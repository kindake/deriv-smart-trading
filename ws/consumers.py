import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from botbuilder.services.strategy_processor import process_blocks
from ws.ws_services.dc import DerivWebSocket
from ws.ws_services.redis_conn import get_connection_status, set_connection_status
from ws.ws_services.socket_registry import active_websockets  # your in-memory dict
from ws.ws_services.socket_registry import register_socket, has_socket, get_socket, update_task, get_task
from shared.shared_q import shared_q
from tutorials.services.chart_processor import handle_chart_subscription
from ws.ws_services import redis_conn
from urllib.parse import parse_qs

class TickDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        await self.accept()
        print("✅ WebSocket Connection Accepted")  # Check Django logs

        # 🔹 Parse query string safely
        query_params = parse_qs(self.scope["query_string"].decode())
        self.client_id = query_params.get("client_id", [None])[0]
        self.is_logged_in = query_params.get("is_logged_in", ["false"])[0] == "true"

        print(f"✅ WebSocket connected: client_id={self.client_id}, is_logged_in={self.is_logged_in}")

        status = get_connection_status(self.client_id)
        if status == "connected":
            print("✅ Existing connection found for client_id:", self.client_id)
        else:
            print("❌ No active connection, creating new one")

        # Try reusing an existing DerivWebSocket
        socket_entry = get_socket(self.client_id)
        if socket_entry and socket_entry.get("websocket"): #  and socket_entry.get("websocket")
            self.websocket = socket_entry["websocket"]
            print("🔁 Reusing existing DerivWebSocket for client_id:", self.client_id)
            print(f"🔁 Reusing DerivWebSocket id={id(self.websocket)} for client_id={self.client_id}")
            self.websocket.client_id = self.client_id
            print(f"🔗 Linked DerivWebSocket.client_id = {self.websocket.client_id}")
        else:
            print("🆕 Creating new DerivWebSocket")
            self.websocket = None
            print("🆕 No existing DerivWebSocket yet for this client.")

            # ✅ Ensure we have a usable DerivWebSocket here
            await self._ensure_socket(
                client_id=self.client_id,
                symbol="1HZ10V",  # or load from query/localStorage
            )

        # 🔹 Retrieve tokens from Redis
        tokens = await redis_conn.get_tokens(self.client_id)
        has_tokens = bool(tokens and (tokens.get("real") or tokens.get("demo")))

        # 🔹 Case 1: Frontend says "logged in" but Redis has no tokens
        if self.is_logged_in and not has_tokens:
            print(f"⚠️ Client marked logged in but no tokens found: {self.client_id}")
            await self.send(text_data=json.dumps({
                "event": "reset_login",
                "message": "No stored tokens found. Resetting login state."
            }))
            # return

        # 🔹 Case 2: Frontend says "logged out" but Redis *has* tokens
        elif not self.is_logged_in and has_tokens:
            print(f"✅ Client marked logged out but tokens found: {self.client_id}")
            await self.send(text_data=json.dumps({
                "event": "set_login_true",
                "message": "Valid tokens found. Restoring logged-in state."
            }))

        # Extract encrypted tokens
        api_token = tokens.get("real")
        demo_token = tokens.get("demo")

        if not api_token or not demo_token:
            print(f"⚠️ Missing token data in Redis for {self.client_id}")
            await self.send(text_data=json.dumps({
                "event": "auth_failed",
                "message": "Incomplete token data. Please re-login."
            }))

        # ✅ Only initialize if not already done
        if shared_q.tick_data_queue is None:
            await shared_q.init_queues()
            print("✅ Queues initialized.")

        print("✅ Tick Queue exists:", shared_q.tick_data_queue is not None)
        print("✅ contracts_data_queue exists:", shared_q.contracts_data_queue is not None)

        print("✅ contracts_data_queue exists:", shared_q.contracts_data_queue is not None)

        self.s_acc = None

        # ✅ USER-SPECIFIC CHANNEL GROUPS
        # Each group now includes the client_id so no overlap occurs
        self.groups = [
            f"tick_data_{self.client_id}",
            f"api_token_data_{self.client_id}",
            f"demo_token_data_{self.client_id}",
            f"balance_data_{self.client_id}",
            f"statement_{self.client_id}",
            f"market_data_{self.client_id}",
            f"asset_data_{self.client_id}",
            f"contract_data_{self.client_id}",
            f"o_c_d_{self.client_id}",
            f"ticks_{self.client_id}",
            f"acc_type_{self.client_id}",
        ]

        for group in self.groups:
            await self.channel_layer.group_add(group, self.channel_name)

        print(f"✅ Added {len(self.groups)} isolated groups for {self.client_id}")

    # -----------------------------------------------------
    async def disconnect(self, close_code):
        """When a client disconnects, remove all their private groups."""
        print(f"⚠️ Disconnecting {self.client_id}...")

        if hasattr(self, "groups"):
            for group in self.groups:
                await self.channel_layer.group_discard(group, self.channel_name)

        print(f"✅ Disconnected and removed groups for {self.client_id}")
        # -----------------------------------------------------

    # -------------------------
    # 🔹 Helper function
    # -------------------------
    async def _ensure_socket(self, client_id, symbol, api_token=None, demo_token=None):
        # 🔁 If already connected, reuse
        if has_socket(client_id):
            print(f"🔁 Client {client_id} already connected. Reusing.")
            entry = get_socket(client_id)
            self.websocket = entry["websocket"]
            try:
                await asyncio.wait_for(self.websocket.connected_event.wait(), timeout=5)
            except asyncio.TimeoutError:
                print(f"⏳ Timeout waiting for existing WebSocket {client_id} to connect")
                return
            return

        # 🌱 Create new
        ws = DerivWebSocket(symbol, api_token, demo_token)
        ws.client_id = client_id
        ws.symbol = symbol

        register_socket(client_id, ws)
        self.websocket = ws
        self.websocket.client_id = self.client_id

        connect_task = asyncio.create_task(ws.connect())
        connect_task.add_done_callback(
            lambda t: print(f"❌ connect_task crashed: {t.exception()}") if t.exception() else None
        )
        update_task(client_id, "connect_task", connect_task)
        set_connection_status(client_id, "connected")

        try:
            await asyncio.wait_for(ws.connected_event.wait(), timeout=5)
            print(f"✅ DerivWebSocket ready (id={id(ws)}) for client {client_id}")
        except asyncio.TimeoutError:
            print(f"⏳ Timeout waiting for WebSocket {client_id} to connect")
            return

    async def receive(self, text_data):
        """Handle messages from the frontend."""
        #print(f"📥 Raw message received: {text_data}")  # Debugging

        try:
            # ✅ Convert JSON string into a Python dictionary
            data = json.loads(text_data)

            event_type = data.get("event")
            symbol = data.get("symbol")
            python_code = data.get("pythonCode")  # Extract Python code
            api_token = data.get("api_token")
            demo_token = data.get("demo_token")
            client_id = data.get("client_id")
            start_date = data.get("start_date")

            # 🔹 Auth-related fields
            accounts = data.get("accounts", {})
            real_account = accounts.get("real", {})
            demo_account = accounts.get("demo", {})

            lang = data.get("lang")

            if event_type == "subscribe_candles":
                symbol = data.get("symbol")
                timeframe = data.get("timeframe")
                print(f"🟢 Subscribing to candles: {symbol}, {timeframe}")

                # Cancel any existing chart task first
                old_chart_task = get_task(self.client_id, "chart_task")
                if old_chart_task:
                    old_chart_task.cancel()
                    try:
                        await old_chart_task
                    except asyncio.CancelledError:
                        print("📉 Previous chart task cancelled before starting new one.")

                # Create and store the new chart task
                new_chart_task = asyncio.create_task(
                    handle_chart_subscription(symbol, timeframe, self.client_id)
                )
                update_task(self.client_id, "chart_task", new_chart_task)

            if event_type == "close_charts":
                print("🧹 Closing chart subscription for client:", self.client_id)

                chart_task = get_task(self.client_id, "chart_task")

                if chart_task:
                    chart_task.cancel()
                    try:
                        await chart_task  # Handle proper async cancellation
                    except asyncio.CancelledError:
                        print("📉 Chart task was cancelled successfully.")
                    update_task(self.client_id, "chart_task", None)
                else:
                    print("⚠️ No active chart task found to cancel.")

            if event_type == "set_start_date":
                self.start_date = start_date
                print(f"✅ Start date set to {self.start_date}")

                # ✅ update inside your DerivWebSocket instance
                self.websocket.start_date = start_date

                # Call profit_table immediately with that start_date
                await self.websocket.profit_table(args={
                    "profit_table": 1,
                    "date_from": self.websocket.start_date,
                    "description": 1
                })

            if event_type == "sell_contract":
                print("🧾🧾🧾🧾🧾🧾 Received sell trigger from frontend!🧾🧾🧾🧾")
                print(data)  # Optionally include full data
                contract_id = data.get("contract_id")
                print(f"🟡 Received sell request for contract ID: {contract_id}")

                if contract_id:
                    await self.websocket.sell(contract_id=contract_id)
                    print("📤 Sent sell request to Deriv API:")
                else:
                    print("⚠️ No contract_id received for sell_contract message")

            if event_type == "reset_virtual_balance":
                print("🧼 Reset Virtual Balance Request Received")
                # Now you can handle it however you want
                await self.websocket.topup_virtual()

            if event_type == "stop_bot":
                print("🚦 Stopping the bot.")
                print("🚦" * 60)

                # Fetch the task from the registry
                bot_task = get_task(self.client_id, "bot_task")

                if bot_task:
                    bot_task.cancel()
                    try:
                        await bot_task  # Await to handle cancellation properly
                    except asyncio.CancelledError:
                        print("🛑 Bot task was cancelled successfully.")
                    update_task(self.client_id, "bot_task", None)
                else:
                    print("⚠️ No bot task running.")

            if event_type == "start_connection":
                self.client_id = client_id

                # 🔁 If already connected, reuse
                if has_socket(client_id):
                    print(f"🔁 Client {client_id} already connected. Reusing.")
                    entry = get_socket(client_id)
                    self.websocket = entry["websocket"]
                    try:
                        await asyncio.wait_for(self.websocket.connected_event.wait(), timeout=5)
                    except asyncio.TimeoutError:
                        print(f"⏳ Timeout waiting for existing WebSocket {client_id} to connect")
                        return
                    return

                # 🌱 Create & register new WebSocket
                ws = DerivWebSocket(symbol, api_token, demo_token)
                ws.client_id = client_id
                ws.symbol = symbol

                register_socket(client_id, ws)
                self.websocket = ws
                # 🔁 If already connected, reuse
                if has_socket(client_id):
                    print(f"🔁 Client {client_id} already connected. Reusing.🔁🔁🔁🔁🔁🔁🔁🔁🔁maish🔁🔁🔁🔁")

                # 🔄 Background connection task
                connect_task = asyncio.create_task(ws.connect())
                connect_task.add_done_callback(
                    lambda t: print(f"❌ connect_task crashed: {t.exception()}") if t.exception() else None
                )
                update_task(client_id, "connect_task", connect_task)
                set_connection_status(client_id, "connected")

                # ⏳ Wait with timeout (avoid infinite hang)
                try:
                    await asyncio.wait_for(ws.connected_event.wait(), timeout=5)
                    print(f"✅ DerivWebSocket ready (id={id(ws)}) for client {client_id}")
                except asyncio.TimeoutError:
                    print(f"⏳ Timeout waiting for WebSocket {client_id} to connect")
                    return

            if event_type == "select_account_real":
                account_type = data.get("type")
                print(f"🔁 Received account type: {account_type}")
                print(f"🔑 Real API token: {api_token}")
                print(f"🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁 Account type selected from frontend: {account_type.upper()}")
                await self.websocket.authenticate(account_type=account_type)

            if event_type == "select_account_demo":
                account_type = data.get("type")
                print(f"🔁 Received account type: {account_type}")
                print(f"🧪 Demo API token: {demo_token}")
                print(f"🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁 Account type selected from frontend: {account_type.upper()}")
                await self.websocket.authenticate(account_type=account_type)

            if event_type == "start_auth":
                print(f"🔍 Authenticating existing WebSocket connection for client_id={client_id}")

                # ✅ Retrieve tokens safely from Redis
                tokens = await redis_conn.get_tokens(client_id)
                if not tokens:
                    print(f"⚠️ No tokens found for client_id={client_id}")
                    await self.send_json({
                        "event": "auth_failed",
                        "message": "No stored tokens found. Please re-login."
                    })
                    return

                # Extract encrypted tokens
                api_token = tokens.get("real")
                demo_token = tokens.get("demo")

                if not api_token or not demo_token:
                    print(f"⚠️ Missing token data in Redis for {client_id}")
                    await self.send_json({
                        "event": "auth_failed",
                        "message": "Incomplete token data. Please re-login."
                    })
                    return

                # ✅ Decrypt before use
                from ws.ws_services.crypto_utils import decrypt_token
                api_token = decrypt_token(api_token)
                demo_token = decrypt_token(demo_token)

                # ✅ Assign decrypted tokens to WebSocket
                self.websocket.token = api_token
                self.websocket.d_token = demo_token
                self.websocket.client_id = self.client_id

                # 🔹 Default to real account authentication
                await self.websocket.authenticate(account_type="real")

                # Wait for Deriv auth confirmation
                await self.websocket.auth_event.wait()

                print("✅ Authenticated successfully. Continuing with balance, tick, and contracts.")

                await self.send_json({
                    "event": "auth_success",
                    "message": "Successfully authenticated via stored tokens."
                })

            elif event_type == "get_contracts":
                print(f"🔄 Switching symbol to {symbol} without restarting WebSocket")

                if hasattr(self, "websocket") and self.websocket:
                    # ✅ Unsubscribe from the old symbol first
                    #await self.websocket.unsubscribe_ticks()

                    # ✅ Update the symbol inside the WebSocket class
                    #self.websocket.symbol = symbol
                    print("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌")

                    # ✅ Fetch contract details for the new symbol
                    await self.websocket.get_contracts(symbol)

                    # ✅ Subscribe to the new symbol without restarting the connection
                    #await self.websocket.subscribe_ticks(symbol)

                    print("1 ❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌")

                else:
                    print("⚠️ No active WebSocket connection found!")

            elif event_type == "run_bot":
                status = get_connection_status(self.client_id)
                if status == "connected":
                    print("✅ Existing connection found for clien t_id:", self.client_id)
                else:
                    print("❌ No active connection, creating new one")

                if python_code:
                    print("🚀 Running Python Code from Frontend:")
                    print(python_code)

                    #self.bot_task = asyncio.create_task(process_blocks(python_code))
                    #self.bot_task = asyncio.create_task(process_blocks(python_code))
                    print(f"📥 Received event from client_id: {self.client_id}")
                    print(data)  # Optionally include full data
                    self.bot_task = asyncio.create_task(process_blocks(python_code, self.client_id)) #  self.websocket,
                    update_task(self.client_id, "bot_task", self.bot_task)

                    # ✅ Send response back to frontend
                    await self.send(json.dumps({
                        "event": "run_bot_response",
                        "status": "started",
                        "message": "Bot is starting."
                    }))
                else:
                    await self.send(json.dumps({
                        "event": "run_bot_response",
                        "status": "error",
                        "error": "No Python code received."
                    }))

        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format received")
        except Exception as e:
            print(f"❌ Unexpected Error in receive(): {e}")

    async def send_tick_data(self, event):
        """Send tick data to the frontend."""
        #print("🔴 Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps(event["data"]))

    async def send_tick_data(self, event):
        """Send tick data to the frontend."""
        #print("🔴 Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps(event["data"]))

    async def send_candle(self, event):
        await self.send(text_data=json.dumps({
            "event": "new_candle",
            "candle": event["candle"],
        }))

    async def send_full_candles(self, event):
        await self.send(text_data=json.dumps({
            "event": "candles",
            "candles": event["candles"],
        }))

    async def send_full_t(self, event):
        await self.send(text_data=json.dumps({
            "event": "t",
            "ticks": event["ticks"],
        }))

    async def send_statement_data(self, event):
        print("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))

    async def send_profit_table_data(self, event):
        print("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))

    async def send_transaction_data(self, event):
        print("?🔴🔴🔴🔴🔴✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 send_transaction_data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps({"event": event["event"], "data": event["data"]}))

    async def send_balance_data(self, event):
        print("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps({"event": "balance", "data": event["data"]}))

    async def send_all_balances(self, event):
        print("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅v Sending Data to Frontend:", event["data"])  # ✅ Debugging
        await self.send(text_data=json.dumps({"event": "all_balances", "data": event["data"]}))

    async def send_active_symbols(self, event):
        await self.send(text_data=json.dumps({"event": "active_symbols", "data": event["data"]}))

    async def send_asset_index(self, event):
        await self.send(text_data=json.dumps({"event": "asset_index", "data": event["data"]}))

    async def send_contracts(self, event):
        await self.send(text_data=json.dumps({"event": "contracts_for", "data": event["data"]}))

    async def send_acc_type(self, event):
        await self.send(text_data=json.dumps({"event": "acc_type", "data": event["data"]}))

    async def send_open_contract(self, event):
        """Send open contract updates to the frontend."""
        #print("📤 Sending open contract data to frontend:", event["data"])
        await self.send(text_data=json.dumps({
            "event": "open_contract_update",
            "data": event["data"]
        }))

    async def send_buy_response(self, event):
        await self.send(text_data=json.dumps({
            "event": "buy_response",
            "data": event["data"]
        }))

    async def send_proposal_update(self, event):
        """Send proposal update to the frontend."""
        print("📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤📤 Sending proposal update to frontend:", event["data"])
        await self.send(text_data=json.dumps({
            "event": "b_proposal_update",
            "data": event["data"]
        }))


        """When a WebSocket client connects, start a background task."""
        '''
        self.group_name = "tick_data"
        self.s_acc = None
        await self.channel_layer.group_add("api_token_data", self.channel_name)
        await self.channel_layer.group_add("demo_token_data", self.channel_name)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.channel_layer.group_add("balance_data", self.channel_name)
        await self.channel_layer.group_add("statement", self.channel_name)
        await self.channel_layer.group_add("market_data", self.channel_name)
        await self.channel_layer.group_add("asset_data", self.channel_name)
        await self.channel_layer.group_add("contract_data", self.channel_name)
        await self.channel_layer.group_add("o_c_d", self.channel_name)
        await self.channel_layer.group_add("ticks", self.channel_name)
        await self.channel_layer.group_add("acc_type", self.channel_name)
'''
    '''
    async def disconnect(self, close_code):
        """When a client disconnects, remove it from the group."""
        print("⚠️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️    disconnected kinda kaisercindy ️️.")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_discard("api_token_data", self.channel_name)
        await self.channel_layer.group_discard("demo_token_data", self.channel_name)
        await self.channel_layer.group_discard("balance_data", self.channel_name)
        await self.channel_layer.group_discard("statement", self.channel_name)
        await self.channel_layer.group_discard("market_data", self.channel_name)
        await self.channel_layer.group_discard("asset_data", self.channel_name)
        await self.channel_layer.group_discard("contract_data", self.channel_name)
        await self.channel_layer.group_discard("o_c_d", self.channel_name)
        await self.channel_layer.group_discard("acc_type", self.channel_name)
        print("⚠️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️⚠️ ️️    disconnected kinda kaisercindy wa jay ️️.")
'''
