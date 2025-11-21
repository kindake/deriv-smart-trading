'''
import asyncio
import websockets

APP_ID = 61801  # Replace with your Deriv app ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"

class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True  # Control variable for the loop

    async def connect(self):
        """Establish WebSocket connection with auto-reconnection."""
        while self.keep_running:
            try:
                print("🔄 Attempting to connect to WebSocket...")
                self.ws = await websockets.connect(DERIV_API_URL)
                print("✅ WebSocket Connected!", self.ws)
                await self.listen()  # Start listening for messages
            except Exception as e:
                print(f"❌ WebSocket Connection Failed: {e}")
                await asyncio.sleep(5)  # Wait before retrying

    async def listen(self):
        """Continuously listen for messages from WebSocket."""
        try:
            async for message in self.ws:
                print(f"📩 Received Message: {message}")  # Debugging purpose
        except websockets.exceptions.ConnectionClosed as e:
            print(f"⚠️ WebSocket Disconnected: {e}")
        finally:
            await self.reconnect()

    async def reconnect(self):
        """Reconnect to WebSocket after disconnection."""
        if self.keep_running:
            print("🔄 Reconnecting in 5 seconds...")
            await asyncio.sleep(5)
            await self.connect()

    async def close(self):
        """Close WebSocket connection gracefully."""
        self.keep_running = False
        if self.ws:
            await self.ws.close()
            print("🔴 WebSocket Disconnected.")

# Run connection when script starts (for testing)
if __name__ == "__main__":
    ws_manager = WebSocketManager()

    try:
        asyncio.run(ws_manager.connect())  # Start WebSocket
    except KeyboardInterrupt:
        asyncio.run(ws_manager.close())  # Gracefully close on exit
'''


'''
import asyncio
import websockets

APP_ID = 61801  # Replace with your valid Deriv app ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"


class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True

    async def connect(self):
        """Establish WebSocket connection with auto-reconnection."""
        while self.keep_running:
            try:
                print("🔄 Attempting to connect to WebSocket...")
                async with websockets.connect(DERIV_API_URL) as ws:
                    self.ws = ws
                    print("✅ WebSocket Connected!")
                    await self.listen()
            except Exception as e:
                print(f"❌ Connection Error: {e}")
                await asyncio.sleep(5)  # Retry after delay

    async def listen(self):
        """Listen for messages from WebSocket."""
        try:
            async for message in self.ws:
                print(f"📩 Received: {message}")  # Process the message
        except websockets.exceptions.ConnectionClosed as e:
            print(f"⚠️ Disconnected: {e}")
        finally:
            await self.reconnect()

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

# Run the WebSocket connection when the script starts
if __name__ == "__main__":
    ws_manager = WebSocketManager()

    try:
        asyncio.run(ws_manager.connect())  # This ensures the script keeps running
    except KeyboardInterrupt:
        asyncio.run(ws_manager.close())  # Gracefully handle exit
'''
'''
import asyncio
import websockets

APP_ID = 61801  # Replace with your Deriv app ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"

class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True

    async def connect(self):
        """Establish WebSocket connection with auto-reconnection."""
        while self.keep_running:
            try:
                print("🔄 Attempting to connect to WebSocket...")
                async with websockets.connect(DERIV_API_URL) as ws:
                    self.ws = ws
                    print("✅ WebSocket Connected!")
                    await self.listen()
            except Exception as e:
                print(f"❌ Connection Error: {e}")
                await asyncio.sleep(5)  # Retry after delay

    async def listen(self):
        """Listen for messages from WebSocket."""
        try:
            async for message in self.ws:
                print(f"📩 Received: {message}")  # Process the message
        except websockets.exceptions.ConnectionClosed as e:
            print(f"⚠️ Disconnected: {e}")
        finally:
            await self.reconnect()

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

ws_manager = WebSocketManager()  # Create global instance
'''

import asyncio
import websockets

APP_ID = 61801  # Replace with your valid Deriv app ID
DERIV_API_URL = f"wss://ws.binaryws.com/websockets/v3?app_id={APP_ID}"

class WebSocketManager:
    def __init__(self):
        self.ws = None
        self.keep_running = True

    async def connect(self):
        """Establish WebSocket connection with auto-reconnection."""
        while self.keep_running:
            try:
                print("🔄 Attempting to connect to WebSocket...")
                '''
                async with websockets.connect(DERIV_API_URL) as ws:
                    self.ws = ws
                    print("✅ WebSocket Connected!")
                    await self.listen()
                '''
                '''
                self.ws = websockets.connect(DERIV_API_URL)
                print("✅ WebSocket Connected!")
                await self.listen()
                '''
                self.ws = await websockets.connect(DERIV_API_URL)
                print("✅ WebSocket Connected!")
                await self.listen()

            except Exception as e:
                print(f"❌ Connection Error: {e}")
                await asyncio.sleep(5)  # Retry after delay

    async def listen(self):
        """Listen for messages from WebSocket."""
        try:
            async for message in self.ws:
                print(f"📩 Received: {message}")  # Process the message
        except websockets.exceptions.ConnectionClosed as e:
            print(f"⚠️ Disconnected: {e}")
        finally:
            await self.reconnect()

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

ws_manager = WebSocketManager()  # Create global instance

