'''
import asyncio
import websockets
import json  # Add this at the top

APP_ID = 61801  # Replace with your Deriv app ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"

class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True

    async def connect(self):
        """Establish a WebSocket connection and maintain it."""
        while self.keep_running:
            try:
                print("🔄 Attempting to connect to Deriv WebSocketiiiiiitttttiiiiiiiittttttiiiiiiii...")
                async with websockets.connect(DERIV_API_URL) as ws:
                    self.ws = ws
                    print("✅ WebSocket Connected!")

                    # Subscribe to market data (example: tick stream for a symbol)
                    await self.send_message({"ticks": "R_100", "subscribe": 1})

                    await self.listen()
            except Exception as e:
                print(f"❌ Connection Error: {e}")
                await asyncio.sleep(5)  # Retry after 5 seconds

    async def listen(self):
        """Listen for messages from WebSocket."""
        try:
            async for message in self.ws:
                print(f"📩 Received: {message}")  # Process the message here
        except websockets.exceptions.ConnectionClosed as e:
            print(f"⚠️ Disconnected: {e}")
        finally:
            await self.reconnect()

    async def send_message(self, message):
        """Send a message to the WebSocket."""
        if self.ws:
            await self.ws.send(json.dumps(message))

    async def reconnect(self):
        """Reconnect to WebSocket after disconnection."""
        if self.keep_running:
            print("🔄 Reconnecting...")
            await asyncio.sleep(5)
            await self.connect()

    async def close(self):
        """Close WebSocket connection gracefully."""
        self.keep_running = False
        if self.ws:
            await self.ws.close()
            print("🔴 WebSocket Disconnected.")

# Global WebSocket manager instance
'''
#ws_manager = WebSocketManager()
'''
import asyncio
import websockets
import json

APP_ID = 61801  # Replace with your actual Deriv App ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"


class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True  # Keeps connection alive

    async def connect(self):
        """Establish WebSocket connection and keep it alive."""
        while self.keep_running:
            try:
                print("🔄 Connecting to Deriv WebSocket...")
                self.ws = await websockets.connect(DERIV_API_URL, timeout=10)  # 10s timeout

                print("✅ WebSocket Connected!")
                await self.send_message({"ticks": "R_100", "subscribe": 1})  # Example: Subscribe to ticks

                await self.listen()
            except websockets.exceptions.ConnectionClosed:
                print("⚠️ Connection closed. Attempting to reconnect...")
            except asyncio.TimeoutError:
                print("⏳ Connection timed out. Retrying in 5s...")
            except Exception as e:
                print(f"❌ Unexpected error: {e}")

            # Wait before reconnecting to avoid rapid failures
            await asyncio.sleep(5)

    async def listen(self):
        """Listen for messages from the WebSocket."""
        try:
            async for message in self.ws:
                data = json.loads(message)
                print(f"📩 Received: {data}")  # Process the message here
        except websockets.exceptions.ConnectionClosed:
            print("⚠️ WebSocket Disconnected.")
        except Exception as e:
            print(f"❌ Error while listening: {e}")

        await self.reconnect()

    async def send_message(self, message):
        """Send a message to the WebSocket."""
        if self.ws and self.ws.open:
            try:
                await self.ws.send(json.dumps(message))
            except Exception as e:
                print(f"❌ Error sending message: {e}")

    async def reconnect(self):
        """Reconnect to WebSocket after disconnection."""
        if self.keep_running:
            print("🔄 Reconnecting in 5s...")
            await asyncio.sleep(5)
            await self.connect()

    async def close(self):
        """Close WebSocket connection gracefully."""
        self.keep_running = False
        if self.ws:
            await self.ws.close()
            print("🔴 WebSocket Disconnected.")


# ✅ Run WebSocket manager in background
ws_manager = WebSocketManager()


async def start_websocket():
    """Start the WebSocket connection in the background."""
'''
    #asyncio.create_task(ws_manager.connect())

import asyncio
import websockets
import json

APP_ID = 61801  # Your Deriv App ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"


class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True
        self.subscriptions = {}  # Store active subscriptions per user session

    async def connect(self):
        """Establish WebSocket connection and keep it alive."""
        while self.keep_running:
            try:
                print("🔄 Connecting to Deriv WebSocket...")
                self.ws = await websockets.connect(DERIV_API_URL, timeout=10)

                print("✅ WebSocket Connected!")

                # Resubscribe to previous requests if connection drops
                for req in self.subscriptions.values():
                    await self.send_message(req)

                await self.listen()
            except websockets.exceptions.ConnectionClosed:
                print("⚠️ Connection closed. Attempting to reconnect...")
            except asyncio.TimeoutError:
                print("⏳ Connection timed out. Retrying in 5s...")
            except Exception as e:
                print(f"❌ Unexpected error: {e}")

            await asyncio.sleep(5)  # Avoid rapid reconnect loops

    async def listen(self):
        """Listen for messages from the WebSocket."""
        try:
            async for message in self.ws:
                data = json.loads(message)
                print(f"📩 Received: {data}")  # You will send this to users
        except websockets.exceptions.ConnectionClosed:
            print("⚠️ WebSocket Disconnected.")
        except Exception as e:
            print(f"❌ Error while listening: {e}")

        await self.reconnect()

    async def send_message(self, message):
        """Send a message to the WebSocket."""
        if self.ws and self.ws.open:
            try:
                await self.ws.send(json.dumps(message))
                self.subscriptions[message["req_id"]] = message  # Store active subscriptions
            except Exception as e:
                print(f"❌ Error sending message: {e}")

    async def close(self):
        """Close WebSocket connection gracefully."""
        self.keep_running = False
        if self.ws:
            await self.ws.close()
            print("🔴 WebSocket Disconnected.")


# ✅ Singleton WebSocket Manager
ws_manager = WebSocketManager()


async def start_websocket():
    """Start WebSocket in the background."""
    asyncio.create_task(ws_manager.connect())


