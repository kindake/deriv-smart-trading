import asyncio
import websockets
import json
from channels.layers import get_channel_layer
from collections import defaultdict
import rx  # ReactiveX for Python
from rx.subject import Subject
from rx import operators as op
from shared.shared_q import shared_q
import asyncio
import time
from .redis_conn import set_connection_status, delete_connection_status
import os

class DerivWebSocket:
    # def __init__(self, api_token, demo_token):
    #def __init__(self, symbol, api_token, demo_token):
    """Initialize WebSocket with authentication details."""
    def __init__(self, symbol="1HZ10V", api_token=None, demo_token=None):
        self.symbol = symbol
        self.token = api_token
        self.d_token = demo_token
        self.app_id = int(os.getenv("APP_ID")  # App ID for authentication
        self.balance = None  # Cached balance
        self.ws = None  # WebSocket connection
        self.subscriptions = {}  # Store active subscriptions for each symbol
        self.current_loginid = None
        self.client_id = None
        self.tokens = {}  # loginid -> 'demo' or 'real'
        self.current_account = {}  # currently selected loginid and type
        self._balance_subscription_sent = False  # 👈 initialize here
        self.balance_subscriptions = {}  # { loginid: req_id }
        self.cached_proposal = None  # Optional: use if you want caching
        self.latest_proposal = None  # 🔹 NEW: Store latest live proposal
        self.cached_proposal = {}  # <-- Fix: start with empty dict
        self.newest_proposal = {}  # 🔹 NEW: Store latest live proposal
        #self.proposal_events = defaultdict(asyncio.Event)  # 🔹 One event per contract_type
        self.proposal_futures = defaultdict(asyncio.Future)
        self.req_id_to_queue = {}

        self.connected_event  = asyncio.Event()   # <-- ADD
        self.listen_task = None                  # <-- ADD
        self.keepalive_task = None               # <-- ADD

        # 🔹 Cached data
        self.cached_active_symbols = None  # Stores active symbols (None means not fetched yet)
        self.cached_asset_index = None  # Stores asset index
        self.cached_balance = None
        self.contracts_data = {}  # Stores contract details per symbol
        self.channel_layer = get_channel_layer()
        self.current_symbol = None  # Store the currently subscribed symbol
        self.subscription_id = None  # Store the subscription ID

        self.is_authenticated = False
        self.auth_event = asyncio.Event()
        self.group_name = "tick_data"
        self.start_date = None   # ✅ add this line

        self.reconnect_lock = asyncio.Lock()
        self.reconnecting = False

    def set_subscription_map(self, subscription_result: dict):
        """
        Store the req_id-to-queue mapping from the subscription manager.
        """
        for key, data in subscription_result.items():
            req_id = data['req_id']
            queue = data['queue']
            self.req_id_to_queue[req_id] = queue
        print("✅ WebSocket now tracking these req_ids:")
        for r, q in self.req_id_to_queue.items():
            print(f"🔁 Req ID {r} → Queue {q}")

    async def create_ws_connection(self):
        url = f"wss://ws.derivws.com/websockets/v3?app_id={self.app_id}"
        print(f"🔄 Connecting to Deriv WebSocket at {url}")

        for attempt in range(3):
            try:
                print(f"🔌 Attempt {attempt + 1}...")
                self.ws = await asyncio.wait_for(websockets.connect(url), timeout=8)
                print("✅ Connected to Deriv WebSocket!")

                # Start background tasks
                self.listen_task = asyncio.create_task(self.listen())
                self.keepalive_task = asyncio.create_task(self.keepalive())

                self.connected_event.set()

                if self.client_id:
                    set_connection_status(self.client_id, "connected")
                    print(f"🧠 Redis: client_id {self.client_id} marked as connected")
                else:
                    print("⚠️ client_id not set, skipping Redis status")

                return True

            except Exception as e:
                import traceback
                print(f"❌ WebSocket connection attempt {attempt + 1} failed: {type(e).__name__}: {e}")
                traceback.print_exc()

                self.ws = None
                self.connected_event.clear()

                if attempt < 2:
                    print("🔁 Retrying in 2s...")
                    await asyncio.sleep(2)
                else:
                    print("❌ All connection attempts failed.")
                    if self.client_id:
                        delete_connection_status(self.client_id)
                    return False

    async def connect(self):
        """Establish a connection to the Deriv WebSocket API."""
        #url = f"wss://ws.binaryws.com/websockets/v3?app_id={self.app_id}"
        #print("🔄 Connecting to Deriv WebSocket...")

        #async with websockets.connect(url) as self.ws:
        #self.ws = await websockets.connect(url)

        # non-blocking
        #asyncio.create_task(self.create_ws_connection())
        #await self.create_ws_connection()
        ok = await self.create_ws_connection()
        if not ok:
            raise ConnectionError("Failed to connect to Deriv WebSocket")

        #print("✅ Connected to WebSocket!")

        # ✅ Now we confirm connection and mark client_id as connected in Redis
        if self.client_id:
            set_connection_status(self.client_id, "connected")
            print(f"🧠 Redis updated: {self.client_id} marked as connected")
        else:
            print("⚠️ Warning: client_id is missing, Redis status not set")


        # ✅ Authenticate only if the API token is not None
        if self.token is not None and self.d_token:
            await self.authenticate()

        # Non-blocking task: setup Channels groups and queues
        #asyncio.create_task(self.deriv_on())

        # Start listening to WebSocket in background
        #asyncio.create_task(self.listen())
        #asyncio.create_task(self.keepalive())  # <--- ADD THIS
        # Listen for responses
        #await self.listen()

            # Load cached active symbols and asset index if available, otherwise fetch them
        if not self.cached_active_symbols:
            await self.get_active_symbols()
        else:
            print("🗄️ Using Cached Active Symbols")

        if not self.cached_asset_index:
            await self.get_asset_index()
        else:
            print("🗄️ Using Cached Asset Index")

        symbol = self.symbol
        # Subscribe to tick data
        #await self.subscribe_ticks(symbol)

        # Fetch contract details for the selected symbol
        await self.get_contracts(symbol)

        # Wait for successful authentication
        await self.auth_event.wait()
        print("🔓 Authenticated, continuing with subscriptions")

        # Transactions
        await self.statement(args={"statement": 1, "limit": 10})
        #await self.profit_table(args={"profit_table": 1, "limit": 10})
        if self.start_date:
            await self.profit_table(args={
                "profit_table": 1,
                "date_from": self.start_date,
                "description": 1
            })
        else:
            await self.profit_table(args={"profit_table": 1, "limit": 10})

        await self.transaction(args={"transaction": 1, "subscribe": 1})

        if not self.cached_balance:
            # Fetch balance
            #await self.get_balance()
            await self.get_balance(loginid=self.current_loginid)
            print(f"📩 Processed Message: dcccccccccccccccccccccccccccccccccccccccc -> {self.symbol}")  # Debugging
        else:
            print("🗄️ Using Cached balance")

        print("✅ Connected to WebSocket!, ✅ Connected to WebSocket!")

        #self.ws = await websockets.connect(url)

        #print("✅ Connected to WebSocket!")

    async def send_ping(self, req_id=None):
        ping_msg = {"ping": 1}
        if req_id is not None:
            ping_msg["req_id"] = req_id
        try:
            await self.ws.send(json.dumps(ping_msg))
            print("📡 Ping sent")
        except Exception as e:
            print(f"⚠️ Failed to send ping: {e}")
            await self.handle_disconnect()

    def set_req_id_map(self, subscription_result: dict):
        """
        Map req_id to queue_name so incoming data can be routed properly.
        """
        for key, info in subscription_result.items():
            req_id = info["req_id"]
            queue_name = info["queue"]
            self.req_id_to_queue[req_id] = queue_name
        print("📜 Updated req_id_to_queue:", self.req_id_to_queue)

    async def keepalive(self, interval=30):
        while True:
            await asyncio.sleep(interval)
            try:
                await self.send_ping()
            except Exception as e:
                print(f"❌ Keepalive ping failed: {e}")
                await self.handle_disconnect()
                break

    async def deriv_on(self):
        # Only init queues once
        if shared_q.tick_data_queue is None:
            await shared_q.init_queues()
            print("✅ Queues initialized.")

        # Add to all groups
        await self.channel_layer.group_add("api_token_data", self.channel_name)
        await self.channel_layer.group_add("demo_token_data", self.channel_name)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.channel_layer.group_add("balance_data", self.channel_name)
        await self.channel_layer.group_add("market_data", self.channel_name)
        await self.channel_layer.group_add("asset_data", self.channel_name)
        await self.channel_layer.group_add("contract_data", self.channel_name)
        await self.channel_layer.group_add("o_c_d", self.channel_name)
        await self.channel_layer.group_add("ticks", self.channel_name)
        await self.channel_layer.group_add("acc_type", self.channel_name)

        print("✅ Deriv groups added for channel:", self.channel_name)

    async def deriv_discon(self):
        if self.channel_layer and self.channel_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.channel_layer.group_discard("api_token_data", self.channel_name)
            await self.channel_layer.group_discard("demo_token_data", self.channel_name)
            await self.channel_layer.group_discard("balance_data", self.channel_name)
            await self.channel_layer.group_discard("market_data", self.channel_name)
            await self.channel_layer.group_discard("asset_data", self.channel_name)
            await self.channel_layer.group_discard("contract_data", self.channel_name)
            await self.channel_layer.group_discard("o_c_d", self.channel_name)
            await self.channel_layer.group_discard("acc_type", self.channel_name)
            print("🔌 Disconnected from Deriv groups for:", self.channel_name)

        # Cancel tasks
        if self.listen_task:
            self.listen_task.cancel()
        if self.keepalive_task:
            self.keepalive_task.cancel()

        if self.client_id:
            delete_connection_status(self.client_id)
            print(f"❌ Redis cleared for {self.client_id}")

        if self.ws:
            await self.ws.close()
            print("🔌 WebSocket closed.")

        print("🛑 Deriv WebSocket tasks stopped")

    async def ensure_connection(self):
        while True:
            try:
                await self.connect()
                await self.listen()  # Only run listen *once* after connecting
            except Exception as e:
                print(f"🔁 WebSocket error: {e}. Reconnecting in 5 seconds...")
                #try:
                 #   await self.ws.close()
                #except:
                 #   pass  # ignore if already closed
                await asyncio.sleep(5)

    async def authenticate(self, account_type: str = None):
        """Send authentication request using tokens securely stored in Redis."""
        from ws.ws_services import redis_conn
        from ws.ws_services.crypto_utils import decrypt_token
        client_id = self.client_id

        # ✅ Get tokens for this client_id from Redis
        tokens = await redis_conn.get_tokens(client_id)
        if not tokens:
            print(f"⚠️ No tokens found for client_id={client_id}")
            return False

        # ✅ Extract and decrypt tokens
        api_token_enc = tokens.get("real")
        demo_token_enc = tokens.get("demo")

        if not api_token_enc and not demo_token_enc:
            print(f"⚠️ Missing both real and demo tokens for client_id={client_id}")
            return False

        # ✅ Decrypt before use
        api_token = decrypt_token(api_token_enc) if api_token_enc else None
        demo_token = decrypt_token(demo_token_enc) if demo_token_enc else None

        # ✅ Choose the token based on account type
        if account_type == "real" and api_token:
            auth_token = api_token
        elif account_type == "demo" and demo_token:
            auth_token = demo_token
        else:
            # fallback
            auth_token = demo_token or api_token

        if not auth_token:
            print(f"❌ No usable token for account_type={account_type}")
            return False

        # ✅ Send auth request
        print(f"🔐 Authenticating {account_type} account for {client_id}...")
        auth_request = {
            "authorize": auth_token,
            "add_to_login_history": 1,
            "req_id": 2001 if account_type == "real" else 2002
        }

        try:
            await self.ws.send(json.dumps(auth_request))
            self.auth_event.clear()
            await self.auth_event.wait()  # Wait until `listen()` receives authorize success
            print(f"🎯 Auth success for {account_type}")
            return True
        except Exception as e:
            print(f"❌ Auth request failed: {e}")
            return False

    async def statement(self, args=None):
        req = {"statement": 1, "req_id": 3001}
        if args:
            req.update(args)
        await self.ws.send(json.dumps(req))

    async def profit_table(self, args=None):
        req = {"profit_table": 1, "req_id": 4001}
        if args:
            req.update(args)
        await self.ws.send(json.dumps(req))


    # ✅ subscribe to transaction stream
    async def transaction(self, args=None):
        if args is None:
            args = {"transaction": 1, "subscribe": 1, "req_id": 5001}
        await self.ws.send(json.dumps(args))

    async def subscribe_ticks(self, new_symbol, req_id=None):
        """Subscribe to tick stream for the symbol with optional req_id."""
        # Guard #1: must be connected
        if not self.connected_event.is_set():
            print("⏳ Waiting for WebSocket connection before subscribing...")
            await self.connected_event.wait()

        # Guard #2: ws must exist
        if not self.ws:
            raise RuntimeError("WebSocket is not connected (ws is None).")

        # switch/dup guards
        if self.symbol and self.symbol in self.subscriptions:
            us = self.symbol
            print(f"🔄 Switching subscription from {self.symbol} to {new_symbol}...")
            self.unsubscribe_ticks(us)

        if new_symbol in self.subscriptions:
            print(f"⚠️ Subscription for {new_symbol} already exists.")
            return

        tick_request = {
            "ticks": new_symbol,
            "subscribe": 1,
            "req_id": req_id or f"{new_symbol}_tick_default"
        }

        await self.ws.send(json.dumps(tick_request))
        self.subscriptions[new_symbol] = tick_request["req_id"]
        self.symbol = new_symbol
        print(f"📩 Tick subscribed for {new_symbol} with req_id: {tick_request['req_id']}")

    def handle_tick_data(self, tick):
        """Handle incoming tick data."""
        if self.symbol in self.subscriptions:
            print(f"📊 Tick Data Received: {tick}")
            # Send data to the frontend (implement this based on your framework)
        else:
            print(f"🚫 Subscription for {self.symbol} is closed. Ignoring tick.")


    async def unsubscribe_ticks(self, symbol):
        """Unsubscribe from the currently subscribed tick stream."""
        if symbol in self.subscriptions:
            subscription_id = self.subscriptions.pop(symbol)  # 🔴 Remove key-value pair

            print(f"🔴 Unsubscribing from {symbol} (Subscription ID: {subscription_id})")
            forget_request = {"forget": subscription_id}

            # ✅ Use await here since it's now async
            await self.ws.send(json.dumps(forget_request))

            self.subscription_id = None  # Reset after unsubscribing
            print("✅ Successfully Unsubscribed!")
            print("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴")

    async def get_active_symbols(self):
        """Request active symbols (only fetch if not cached)."""
        if not self.cached_active_symbols:  # Fetch only if cache is empty
            request = {"active_symbols": "brief", "product_type": "basic"}
            await self.ws.send(json.dumps(request))
        else:
            print("🗄️ Using Cached Active Symbols")

    async def get_asset_index(self):
        """Request asset index (only fetch if not cached)."""
        if not self.cached_asset_index:  # Fetch only if cache is empty
            request = {"asset_index": 1}
            await self.ws.send(json.dumps(request))
        else:
            print("🗄️ Using Cached Asset Index")

    async def get_contracts(self, symbol):
        """Request contract details for the given symbol."""
        request = {"contracts_for": symbol}
        await self.ws.send(json.dumps(request))
        print(f"🗄️ Using Cached Contracts for {symbol}")

    async def buy(self, buy_payload):

        print(f"proposal data: {buy_payload}")
        proposal_id = buy_payload.get("id")
        payout = buy_payload.get("payout")

        buy_request = {
            "buy": proposal_id,
            "price": payout,
            "req_id": 999,
        }
        await self.ws.send(json.dumps(buy_request))

    async def sell(self, contract_id: int, price: float = 0, passthrough: dict = None, req_id: int = 1):
        """
        Sell a contract using contract_id and price (0 = market).
        """
        try:
            request = {
                "sell": contract_id,
                "price": price,
                "req_id": req_id
            }

            if passthrough:
                request["passthrough"] = passthrough

            await self.ws.send(json.dumps(request))
            print(f"📤 Sent sell request for contract {contract_id} at price {price}")

        except Exception as e:
            print(f"⚠️ Error sending sell request: {e}")

    async def topup_virtual(self):
        request = {
            "topup_virtual": 1,
        }
        await self.ws.send(json.dumps(request))  # send request

    async def proposal_open_con(self, contract_id):

        print("📦 Contract ID received:", contract_id)
        # "proposal_open_contract": 1,
        request = {
            "proposal_open_contract": 1,
            "contract_id": contract_id,
            "subscribe": 1  # to keep receiving updates
        }
        await self.ws.send(json.dumps(request))

        print("🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️")

    async def get_proposal(self, proposal_data: dict, use_cache=False):
        print("🔍 Received Proposal Data:", proposal_data)
        if self.cached_proposal is None:
            self.cached_proposal = {}

        try:
            if all(isinstance(v, dict) for v in proposal_data.values()):
                for label, data in proposal_data.items():
                    if use_cache and self.cached_proposal.get(label) == data:
                        print(f"🗄️ Using Cached Proposal for {label}---{data}")
                        continue

                    json_data = json.dumps(data)
                    print(f"📤 Sending Proposal for {label}: {json_data}")

                    await self.ws.send(json_data)

                self.cached_proposal = proposal_data.copy()

            else:
                if use_cache and self.cached_proposal == proposal_data:
                    print("🗄️ Using Cached Proposal")
                else:
                    json_data = json.dumps(proposal_data)
                    print("📤 Sending Single Proposal:", json_data)

                    await self.ws.send(json_data)
                    self.cached_proposal = proposal_data.copy()

        except Exception as e:
            print("🔥 Exception while sending proposal(s):", e)

    async def get_balance(self, loginid=None):
        loginid = loginid or "current"
        if loginid in self.balance_subscriptions:
            print(f"🔁 Already subscribed to balance for {loginid} with req_id {self.balance_subscriptions[loginid]}")
            return

        req_id = hash(loginid) % 10_000_000  # Unique but manageable number
        balance_request = {
            "balance": 1,
            "subscribe": 1,
            "account": loginid,
            "req_id": req_id,
        }

        try:
            await self.ws.send(json.dumps(balance_request))
            # ✅ Now we initialize the full structure
            self.balance_subscriptions[loginid] = {
                "req_id": req_id,
                "balance": None,  # Will be updated later when data is received
                "currency": None,
            }
            print(f"✅ Subscribed to balance for {loginid}, req_id: {req_id}")
        except Exception as e:
            print(f"❌ Failed to subscribe to balance for {loginid}: {e}")


    async def unsubscribe_balance(self, loginid):
        if loginid not in self.balance_subscriptions:
            return

        unsubscribe_request = {
            "balance": 1,
            "unsubscribe": 1,
            "req_id": self.balance_subscriptions[loginid]
        }

        try:
            await self.ws.send(json.dumps(unsubscribe_request))
            print(f"🔕 Unsubscribed from balance for {loginid}")
            del self.balance_subscriptions[loginid]
        except Exception as e:
            print(f"❌ Failed to unsubscribe: {e}")

    async def subscribe_candlestick_data(self, symbol, timeframe_str, req_id=None):
        now = int(time.time())
        start = now - 1000 * 60  # 1000 minutes ago (approx 16 hours)

        granularity_map = {
            '1m': 60, '2m': 120, '5m': 300, '10m': 600, '15m': 900,
            '30m': 1800, '1h': 3600, '2h': 7200, '4h': 14400,
            '8h': 28800, '12h': 43200, '1d': 86400,
        }


        # ✅ Ensure req_id is an integer
        if not isinstance(req_id, int):
            req_id = int(time.time() * 1000)  # unique fallback

        granularity = granularity_map.get(timeframe_str)
        payload = {
            "ticks_history": symbol,
            "start": start,
            "end": "latest",
            "subscribe": 1,
            "req_id": req_id or f"{symbol}_{timeframe_str}_default"
        }

        if timeframe_str == "tick":
            payload["style"] = "ticks"
            payload["count"] = 1000
        else:
            payload["style"] = "candles"
            payload["granularity"] = granularity

        try:
            await self.ws.send(json.dumps(payload))
            print(f"🟢 Subscribed to: {symbol}, timeframe: {timeframe_str}, req_id: {payload['req_id']}")
        except Exception as e:
            print(f"❌ Failed to subscribe: {e}")

    '''
    async def handle_disconnect(self):
        retry_count = 0
        while True:
            print(f"🔁 Attempting to reconnect WebSocket (attempt {retry_count + 1}) in 3 seconds...")
            await asyncio.sleep(3)

            try:
                await self.connect()
                print("✅ Reconnected successfully!")
                break  # ✅ Exit loop after successful reconnect
            except Exception as e:
                print(f"❌ Reconnect attempt {retry_count + 1} failed: {e}")
                retry_count += 1
'''
    async def handle_disconnect(self):

        # --- Prevent multiple concurrent reconnect attempts ---
        if self.reconnecting:
            return

        async with self.reconnect_lock:
            if self.reconnecting:
                return

            self.reconnecting = True
            print("🔌 Disconnect detected — starting controlled reconnection")

            # Close old socket safely
            try:
                if self.ws and not self.ws.closed:
                    await self.ws.close()
            except:
                pass

            self.ws = None

            retry = 1
            while True:
                print(f"🔁 Reconnect attempt {retry}...")

                try:
                    await self.connect()  # ⬅️ THIS calls create_ws_connection()
                    print("✅ WebSocket reconnected successfully!")
                    break

                except Exception as e:
                    print(f"❌ Reconnect attempt {retry} failed: {e}")
                    retry += 1
                    await asyncio.sleep(2)

            self.reconnecting = False

    async def listen(self):
        #channel_layer = get_channel_layer()
        try:
            """Listen for incoming WebSocket messages."""
            async for message in self.ws:
                data = json.loads(message)

                # Print received data
                print("📩 Received:", data)
                #if "tick" in data:
                 #   print("✅")
                #else:
                 #   print("📩 Received:", data)

                req_id = data.get("req_id")  # 👈 Safely extract req_id

                if req_id:
                    if req_id in self.req_id_to_queue:
                        queue_name = self.req_id_to_queue[req_id]
                        #queue = getattr(shared_q, queue_name, None)
                        queue = shared_q.subscription_queues.get(queue_name)
                        if queue:
                            await queue.async_q.put(data)
                            #print(f"✅ Data added to queue '{queue_name}': {data}")  # 👈 Add this line
                        else:
                            print(f"⚠️ Queue '{queue_name}' not found in shared_q.")
                        print(f"📜 Current req_id_to_queue map: {self.req_id_to_queue}")
                    else:
                        print(f"⚠️ Unknown req_id received: {req_id}: {data}")
                        print(f"📜 Current req_id_to_queue map: {self.req_id_to_queue}")

                #else:
                 #   print(f"⚠️ Incoming message has no req_id: {data}")

                if "candles" in data:
                    #print("📩 Received full candles list:", data)
                    client_group = f"tick_data_{self.client_id}"
                    await self.channel_layer.group_send(
                        #"tick_data",
                        client_group,
                        {
                            "type": "send.full_candles",  # 👈 custom type for full history
                            "candles": data["candles"],
                        }
                    )

                if "statement" in data:
                    print("📩 statement:", data)
                    client_group = f"statement_{self.client_id}"
                    await self.channel_layer.group_send(
                        #"statement",
                        client_group,
                        {
                            "type": "send_statement_data",  # 👈 custom type for full history
                            "event": "profit_table",
                            "data": data,
                        }
                    )

                if "profit_table" in data:
                    print("📩 profit_table:", data)
                    client_group = f"statement_{self.client_id}"
                    await self.channel_layer.group_send(
                        #"statement",
                        client_group,
                        {
                            "type": "send_profit_table_data",  # 👈 custom type for full history
                            "event": "profit_table",
                            "data": data,
                        }
                    )

                if "transaction" in data:
                    print("📩 transaction:", data)
                    #await self.profit_table(args={"profit_table": 1, "limit": 100})
                    if self.start_date:
                        await self.profit_table(args={
                            "profit_table": 1,
                            "date_from": self.start_date,
                            "description": 1
                        })
                    else:
                        await self.profit_table(args={"profit_table": 1, "limit": 100})

                    client_group = f"statement_{self.client_id}"

                    await self.channel_layer.group_send(
                        #"statement",
                        client_group,
                        {
                            "type": "send_transaction_data",  # 👈 custom type for full history
                            "event": "transaction",
                            "data": data,
                        }
                    )

                if "history" in data and "prices" in data["history"] and "times" in data["history"]:
                    #print("📩 Received tick history:", data)

                    prices = data["history"]["prices"]
                    times = data["history"]["times"]

                    # ⏱ Convert to {time, value} format expected by Lightweight Charts LineSeries
                    tick_line_data = [
                        {"time": int(t), "value": float(p)}
                        for t, p in zip(times, prices)
                    ]

                    # 📤 Send to frontend with a clearer message type
                    client_group = f"tick_data_{self.client_id}"
                    await self.channel_layer.group_send(
                        #"tick_data",
                        client_group,
                        {
                            "type": "send.full_t",  # ⬅️ Better name
                            "ticks": tick_line_data,
                        }
                    )

                if "candles" in data:
                    #print("📩 Received:", data)
                    candle = data["candles"][-1]  # most recent candle
                    client_group = f"tick_data_{self.client_id}"

                    await self.channel_layer.group_send(
                        #"tick_data",
                        client_group,
                        {
                            "type": "send.candle",
                            "candle": candle,
                        }
                    )

                if "proposal" in data:

                    #await shared.shared_q.c_d_queue.async_q.put(data)  # Correct Janus async usage
                    await shared_q.c_d_queue.async_q.put(data)  # Correct Janus async usage

                    proposal_info = data["proposal"]
                    echo_info = data.get("echo_req", {})

                    contract_type = echo_info.get("contract_type")
                    proposal_id = proposal_info.get("id")
                    payout = proposal_info.get("payout")

                    self.newest_proposal[contract_type] = {
                        "id": proposal_info.get("id"),
                        "payout": proposal_info.get("payout"),
                    }

                    print(f"💾 Stored proposal for {contract_type}: {self.newest_proposal[contract_type]}")


                if "buy" in data:
                    req_id = data.get("req_id")
                    contract_id = data.get("buy", {}).get("contract_id")
                    await self.proposal_open_con(contract_id)
                    #await shared.shared_q.buy_data_queue.async_q.put(data)  # Correct Janus async usage
                    await shared_q.buy_data_queue.async_q.put(data)  # Correct Janus async usage
                    channel_layer = get_channel_layer()
                    client_group = f"contract_data_{self.client_id}"

                    await channel_layer.group_send(
                        #"contract_data",
                        client_group,
                        {
                            "type": "send_buy_response",
                            "data": data
                        }
                    )

                if "proposal_open_contract" in data:
                    #print("🧾 Received contract update:", data)
                    #await shared.shared_q.poc_data_queue.async_q.put(data)  # Correct Janus async usage
                    await shared_q.poc_data_queue.async_q.put(data)  # Correct Janus async usage
                    channel_layer = get_channel_layer()
                    client_group = f"statement_{self.client_id}"

                    await channel_layer.group_send(
                        #"contract_data",  # Same group name your consumer is listening to
                        client_group,
                        {
                            "type": "send_open_contract",
                            "data": data  # This is the open contract payload
                        }
                    )

                if "authorize" in data:
                    print("✅ Authorization successful")
                    print("🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢Authorization data:", data)

                    self.is_authenticated = True
                    self.auth_event.set()

                    auth_data = data["authorize"]
                    self.current_loginid = auth_data["loginid"]

                    # 🟢 STEP 1: Save current account type
                    is_virtual = auth_data.get("is_virtual", 0)
                    account_type = "demo" if is_virtual == 1 else "real"
                    self.current_account = {
                        "loginid": self.current_loginid,
                        "type": account_type
                    }

                    # 🟢 STEP 2: Save demo and real accounts with type as key
                    self.tokens = {}  # Reset
                    for account in auth_data.get("account_list", []):
                        #loginid = account.get("loginid")
                        is_virtual_acc = account.get("is_virtual", 0)
                        acc_type = "demo" if is_virtual_acc == 1 else "real"
                        self.tokens[acc_type] = account.get("loginid")

                    print("🔐 Current account selected:", self.current_account)
                    #await self.get_balance()
                    await self.get_balance(loginid=self.current_loginid)
                    print("🔐 All available accounts:", self.tokens)

                    # Transactions
                    await self.statement(args={"statement": 1, "limit": 10})
                    #await self.profit_table(args={"profit_table": 1, "limit": 100})
                    if self.start_date:
                        await self.profit_table(args={
                            "profit_table": 1,
                            "date_from": self.start_date,
                            "description": 1
                        })
                    else:
                        await self.profit_table(args={"profit_table": 1, "limit": 100})

                    await self.transaction(args={"transaction": 1, "subscribe": 1})

                    asyncio.create_task(
                        self.channel_layer.group_send(
                            #"acc_type",
                            f"acc_type_{self.client_id}",
                            {"type": "send_acc_type", "data": {"acc_type": self.current_account}}
                        )
                    )

                    # Send all balances known so far
                    asyncio.create_task(
                        self.channel_layer.group_send(
                            #"api_token_data",
                            f"api_token_data_{self.client_id}",
                            {
                                "type": "send_all_balances",
                                "data": self.balance_subscriptions
                            }
                        )
                    )
                    asyncio.create_task(
                        self.channel_layer.group_send(
                            #"balance_data",
                            f"balance_data_{self.client_id}",
                            {"type": "send_balance_data", "data": {"balance": self.balance}}
                        )
                    )

                # ✅ Handle tick data
                if "tick" in data:
                    #print("📩 Receivedjjjjjjjjjjjjjjjiiiiiiiiiiiiiiiiiffffffffff:", data)
                    tick_data = data["tick"]

                    #await shared.shared_q.tick_data_queue.async_q.put(data)  # Correct Janus async usage
                    await shared_q.tick_data_queue.async_q.put(data)

                    subscription_id = data.get("subscription", {}).get("id")
                    symbol = data.get("tick", {}).get("symbol")

                    #print(f"Symbol: {symbol}, Subscription ID: {subscription_id}")

                    self.subscriptions[symbol] = data.get("subscription", {}).get("id")
                    #self.subscription_id = data.get("subscription", {}).get("id")
                    #print(self.subscription_id)  # Output: 3e0a8cd7-b4ec-2be4-d3d3-4e88998bbf55

                    # ✅ Create a task instead of awaiting directly
                    asyncio.create_task(
                        self.channel_layer.group_send(f"tick_data_{self.client_id}", {"type": "send_tick_data", "data": tick_data}))
                    #asyncio.create_task(
                     #   self.channel_layer.group_send("tick_data", {"type": "send_tick_data", "data": tick_data}))
                    #print("📩 bhhhhhhhhhhgdrrrrrrrrrrrrrrrrttttttttttt:")


                # ✅ Forward balance update only if changed (for instant UI update)
                #if "balance" in data:
                 #   self.balance = data #["balance"]["balance"]

                  #  await shared.shared_q.balance_data_queue.async_q.put(self.balance)

                   # print("💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰 New Balance Received:", self.balance)
                    #asyncio.create_task(self.channel_layer.group_send("balance_data", {"type": "send_balance_data", "data": {"balance": self.balance}}))

                if "balance" in data:
                    req_id = data.get("req_id")
                    balance_info = data["balance"]
                    loginid = balance_info["loginid"]
                    balance_value = balance_info.get("balance")
                    currency = balance_info.get("currency")

                    print(f"💰 Balance update for {loginid}: {req_id}: {balance_value} {currency}")

                    # 🔄 Update your tracking dictionary
                    self.balance_subscriptions[loginid] = {
                        "req_id": req_id,
                        "balance": balance_value,
                        "currency": currency,
                    }

                    asyncio.create_task(
                        self.channel_layer.group_send(
                            #"api_token_data",
                            f"api_token_data_{self.client_id}",
                            {
                                "type": "send_all_balances",
                                "data": self.balance_subscriptions  # ✅ Sending the whole dict
                            }
                        )
                    )

                if "balance" in data:
                    self.balance = data

                    #await shared.shared_q.balance_data_queue.async_q.put(self.balance)
                    await shared_q.balance_data_queue.async_q.put(self.balance)

                    print("💰 New Balance Received:💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰 New Balance Received:", self.balance)
                    asyncio.create_task(
                        self.channel_layer.group_send(
                            #"balance_data",
                            f"balance_data_{self.client_id}",
                            {"type": "send_balance_data", "data": {"balance": self.balance}}
                        )
                    )

                elif "active_symbols" in data:
                    self.cached_active_symbols = data["active_symbols"]  # Cache data
                    print(f"📜 Active Symbols Cached: {len(self.cached_active_symbols)} symbols received")

                    async def get_market_structure(active_symbols):
                        """Processes cached active symbols into a structured market hierarchy."""
                        if not active_symbols:
                            print("No active symbols available.")
                            return {}

                        market_structure = defaultdict(
                            lambda: {"status": "closed",
                                     "submarkets": defaultdict(lambda: {"status": "closed", "symbols": []})}
                        )

                        for symbol in active_symbols:  # No need to call `['active_symbols']` since we pass raw data
                            market = symbol.get('market_display_name')
                            submarket = symbol.get('submarket_display_name')
                            is_open = symbol.get('exchange_is_open') == 1

                            if market and submarket:  # Ensure values are present
                                # Update market and submarket statuses
                                if is_open:
                                    market_structure[market]["status"] = "open"
                                    market_structure[market]["submarkets"][submarket]["status"] = "open"

                                # Append symbol info
                                market_structure[market]["submarkets"][submarket]["symbols"].append({
                                    "display_name": symbol.get('display_name'),
                                    "symbol": symbol.get('symbol'),
                                    "is_open": "open" if is_open else "closed"
                                })

                        # Convert defaultdict to regular dict for serialization
                        return {k: dict(v) for k, v in market_structure.items()}

                    # Process market structure using cached active symbols
                    market_structure = await get_market_structure(self.cached_active_symbols)

                    # Send processed market structure data to the channel layer
                    asyncio.create_task(self.channel_layer.group_send(
                        #"market_data",
                        f"market_data_{self.client_id}",
                        {"type": "send_active_symbols", "data": market_structure}
                    ))


                elif "asset_index" in data:
                    self.cached_asset_index = data #["asset_index"]  # ✅ Store cached asset index
                    #print(f"📊 Asset Index Cached: {len(self.cached_asset_index)} assets received")

                    async def get_asset_data(cached_asset_index):
                        try:
                            # ✅ Use cached data if available, otherwise fetch new data
                            assets = cached_asset_index #cached_assets if cached_assets is not None else await get_active_assets()
                            #print("📜 asset_data 1", assets)

                            if not assets:
                                print("⚠️ No asset data available.")
                                return []

                            def parse_asset_data(asset_data):
                                parsed_assets = []

                                # Check if asset_data has 'asset_index' and it's a list
                                if 'asset_index' in asset_data and isinstance(asset_data['asset_index'], list):
                                #if isinstance(asset_data['asset_index'], list):
                                #if 'asset_index' in asset_data:
                                    #print("📜 asset_data 2", asset_data)
                                    for asset in asset_data['asset_index']:
                                        # Asset should have [symbol, display_name, options_list]
                                        if isinstance(asset, list) and len(asset) >= 3:
                                            symbol, display_name, options = asset[0], asset[1], asset[2]
                                            parsed_options = []

                                            # Process options list
                                            if isinstance(options, list):
                                                for option in options:
                                                    if isinstance(option, list) and len(option) >= 4:
                                                        # Extract option details (contract type, name, duration_min, duration_max)
                                                        contract_type, name, duration_min, duration_max = option[:4]
                                                        parsed_options.append({
                                                            'contract_type': contract_type,
                                                            'name': name,
                                                            'duration_min': duration_min,
                                                            'duration_max': duration_max
                                                        })

                                            parsed_assets.append({
                                                'symbol': symbol,
                                                'display_name': display_name,
                                                'options': parsed_options
                                            })
                                            #print("📜 asset_data 2", parsed_assets)

                                        else:
                                            print(f"Unexpected asset format: {asset}")

                                return parsed_assets

                            # ✅ Process the asset data using `parse_asset_data()`
                            parsed_assets = parse_asset_data(assets)  # Make sure parse_asset_data is defined

                            asset_data = []
                            for asset in parsed_assets:
                                options = [
                                    {
                                        "contract_type": option["contract_type"],
                                        "name": option["name"],
                                        "duration_min": option["duration_min"],
                                        "duration_max": option["duration_max"]
                                    }
                                    for option in asset["options"]
                                ]
                                asset_data.append({
                                    "symbol": asset["symbol"],
                                    "display_name": asset["display_name"],
                                    "options": options
                                })

                            return asset_data

                        except Exception as e:
                            print("❌ Error in get_asset_data:", e)
                            raise

                    # ✅ Call `get_asset_data()` using the cached asset index
                    self.asset_data = await get_asset_data(self.cached_asset_index)
                    #print("📜 asset_data L", self.asset_data)
                    # ✅ Send processed asset data to WebSocket group
                    asyncio.create_task(self.channel_layer.group_send(
                        f"asset_data_{self.client_id}", {"type": "send_asset_index", "data": self.asset_data}
                    ))
                    #asyncio.create_task(self.channel_layer.group_send(
                     #   "asset_data", {"type": "send_asset_index", "data": self.asset_data}
                    #))



                # Handle contract information update
                elif "contracts_for" in data:
                    #print("📜 Active Symbols Cached:", data)

                    #await shared.shared_q.contracts_data_queue.async_q.put(data)  # Correct Janus async usage
                    #await shared.shared_q.tick_data_queue.async_q.put(data)  # Correct Janus async usage

                    self.contracts_data[self.symbol] = data  #["contracts_for"]
                    print(f"📜 Contracts Cached for {self.symbol}: {len(self.contracts_data[self.symbol]['contracts_for']['available'])} contracts available")

                    async def parse_contracts(data):
                        #print("📜 Active Symbols Cached:", data)
                        available_contracts = data.get("contracts_for", {}).get("available", [])
                        #available_contracts = data.get("available", [])
                        contract_categories = {}
                        #print("📜 Active Symbols 1111111111:", available_contracts)

                        for contract in available_contracts:
                            # Extract details
                            category = contract["contract_category"]
                            category_display = contract["contract_category_display"]
                            contract_type = contract["contract_type"]
                            contract_display = contract["contract_display"]
                            contract_category = contract["contract_category"]
                            sentiment = contract.get("sentiment")
                            barriers = contract.get("barriers", 0)
                            barrier_category = contract.get("barrier_category")
                            barrier_details = {
                                "barrier": contract.get("barrier"),
                                "high_barrier": contract.get("high_barrier"),
                                "low_barrier": contract.get("low_barrier"),
                            }
                            growth_rate_range = contract.get("growth_rate_range")
                            default_stake = contract.get("default_stake")
                            max_contract_duration = contract.get("max_contract_duration")
                            min_contract_duration = contract.get("min_contract_duration")
                            multiplier_range = contract.get("multiplier_range")
                            expiry_type = contract.get("expiry_type")
                            start_type = contract.get("start_type")
                            last_digit_range = contract.get("last_digit_range")
                            exchange_name = contract.get("exchange_name")
                            contract_category_display = contract.get("contract_category_display")

                            # Group by contract category
                            if category not in contract_categories:
                                contract_categories[category] = {
                                    "category_display": category_display,
                                    "contracts": []
                                }

                            # Add contract details
                            contract_categories[category]["contracts"].append({
                                "contract_type": contract_type,
                                "contract_display": contract_display,
                                "contract_category": contract_category,
                                "sentiment": sentiment,
                                "barriers": barriers,
                                "barrier_category": barrier_category,
                                "barrier_details": barrier_details,
                                "growth_rate_range": growth_rate_range,
                                "default_stake": default_stake,
                                "max_contract_duration": max_contract_duration,
                                "min_contract_duration": min_contract_duration,
                                "multiplier_range": multiplier_range,
                                "expiry_type": expiry_type,
                                "start_type": start_type,
                                "last_digit_range": last_digit_range,
                                "exchange_name": exchange_name,
                                "contract_category_display": contract_category_display,

                            })

                        return contract_categories

                    contract_ = await parse_contracts(self.contracts_data[self.symbol])
                    #await shared.shared_q.contracts_data_queue.async_q.put(contract_)  # Correct Janus async usage
                    await shared_q.contracts_data_queue.async_q.put(contract_)

                    #asyncio.create_task(self.channel_layer.group_send("contract_data", {"type": "send_contracts", "data": contract_}))
                    asyncio.create_task(self.channel_layer.group_send(f"contract_data_{self.client_id}", {"type": "send_contracts", "data": contract_}))
                '''
        except websockets.exceptions.ConnectionClosedrError as e:
            print(f"🔌 Connection closed unexpectedly: {e}")
            await self.handle_disconnect()
'''
        except websockets.exceptions.ConnectionClosedError as e:
            print(f"🔌 Connection closed unexpectedly: {e}")

            # 🔥 NEW: reset reconnect lock immediately
            if self.reconnecting:
                print("⚠️ reconnecting flag was TRUE — forcing to FALSE")
                self.reconnecting = False
            else:
                print("ℹ️ reconnecting flag already FALSE")

            print("➡️ Calling handle_disconnect() now...")
            await self.handle_disconnect()
            print("⬅️ handle_disconnect() finished")

        except Exception as e:
            print(f"❌ Unhandled exception in listen: {e}")
            await self.handle_disconnect()
