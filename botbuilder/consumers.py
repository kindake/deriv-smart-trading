import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from botbuilder.services.strategy_processor import subscribe_market_data
from deriv_api import DerivAPI
import pandas as pd


class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("✅ WebSocket connection established.")

        #self.keep_alive_task = asyncio.create_task(self.keep_alive())  # Keep connection alive
        self.market_task = asyncio.create_task(self.subscribe_to_market_data())

        self.channel_layer = get_channel_layer()
        self.group_name = "market_data_group"

        # Add the WebSocket to the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        print("✅ WebSocket added to group:", self.group_name)  # Debug print

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Cancel running tasks
        for task in [self.market_task]:
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
        print("❌ WebSocket Disconnected and Tasks Stopped!")

    '''
    async def keep_alive(self):
        """Send a keep-alive ping to prevent disconnection."""
        try:
            while True:
                await self.send(json.dumps({"type": "ping"}))  # Send keep-alive ping
                #await asyncio.sleep(30)  # Send every 30 seconds
        except asyncio.CancelledError:
            print("Keep-alive task stopped.")
'''

    async def send_tick(self, event):
        print("📡 Sending tick data:", (event["tick"]))  # Debugging
        await self.send(json.dumps(event["tick"]))

    async def subscribe_to_market_data(self):
        """Subscribe to market data when the WebSocket connects."""
        app_id = 61801
        api = DerivAPI(app_id=app_id)  # Initialize your API object
        symbol = "1HZ10V"
        update_queue = asyncio.Queue()
        df_queue = asyncio.Queue()
        Roat1_result = {}
        indicator_df = {}
        tick_data = pd.DataFrame(columns=['timestamp', 'ask', 'bid', 'quote', 'pip_size', 'spread'])

        # Start the market data subscription
        asyncio.create_task(subscribe_market_data(api, symbol, update_queue , df_queue, Roat1_result, indicator_df, tick_data))

        # Continuously read from the update queue and send data to the front end
        try:
            while True:
                latest_tick = await update_queue.get()
                tick_data = await df_queue.get()
                print("✅ Got latest_tick data:", latest_tick)  # Add this line
                print("✅ Got tick data:", tick_data)  # Add this line

                await self.channel_layer.group_send(
                    "market_data_group",
                    {"type": "send_tick", "tick": latest_tick}
                )

                #await self.send(json.dumps(latest_tick))
                #await self.send(json.dumps(latest_tick))
                await asyncio.sleep(1)  # Simulating real-time updates
        except asyncio.CancelledError:
            print("Market data subscription stopped.")
'''
    async def send_tick_data(self, event):
        """Receive messages from the channel layer and send to WebSocket."""
        tick_data = event["tick_data"]
        await self.send(json.dumps(tick_data))
'''
'''
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from botbuilder.services.strategy_processor import subscribe_market_data
from deriv_api import DerivAPI


class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("✅ WebSocket connection established.")

        self.channel_layer = get_channel_layer()
        self.group_name = "market_data_group"

        # Add the WebSocket to the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Start the market data subscription task
        asyncio.create_task(self.subscribe_to_market_data())

    async def disconnect(self, close_code):
        print(f"❌ WebSocket disconnected: {close_code}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def subscribe_to_market_data(self):
        """Subscribe to market data when the WebSocket connects."""
        app_id = 61801
        api = DerivAPI(app_id=app_id)  # Initialize your API object
        symbol = "1HZ10V"
        update_queue = asyncio.Queue()

        # Start the market data subscription
        asyncio.create_task(subscribe_market_data(api, symbol, update_queue, self.channel_layer))

        # Continuously read from the update queue and send data to the front end
        while True:
            latest_tick = await update_queue.get()
            await self.send(json.dumps(latest_tick))

    async def send_tick_data(self, event):
        """Receive messages from the channel layer and send to WebSocket."""
        tick_data = event["tick_data"]
        await self.send(json.dumps(tick_data))

'''
'''

import asyncio
import websocket
from channels.generic.websocket import AsyncWebsocketConsumer
import json9
#from services.strategy_processor import subscribe_market_data
from botbuilder.services.strategy_processor import subscribe_market_data
from deriv_api import DerivAPI
from channels.layers import get_channel_layer


APP_ID = 61801


class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles WebSocket connection"""
        print("WebSocket connection attempt received")

        print(" WebSocket connection established.")
        self.channel_layer = get_channel_layer()
        self.group_name = "market_data_group"

        # Add the WebSocket to the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        print("WebSocket connected and added to market_data_group")

        # Hardcoded symbol (consider making this dynamic)
        symbol = "R_50"
        # Start subscription BEFORE adding to the group
        update_queue = asyncio.Queue()
        api = DerivAPI(app_id=APP_ID)
        # Start the market data subscription
        asyncio.create_task(subscribe_market_data(api, symbol, update_queue, self.channel_layer))

        await self.accept()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection"""
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print("WebSocket disconnected")

    async def send_tick_data(self, event):
        """Receive messages from the channel layer and send to WebSocket."""
        tick_data = event["tick_data"]
        print(f"Received tick data in consumer: {tick_data}")
        await self.send(t_data=json.dumps(tick_data))
        print("Sent tick_data")

'''
'''
    async def send_tick_data(self, event):
        """Sends tick data to WebSocket clients"""
        tick_data = event["tick_data"]
        print(f"Received tick data in consumer: {tick_data}")
        await self.send(json.dumps(tick_data))
'''
'''
from channels.generic.websocket import AsyncWebsocketConsumer
import json
#from services.strategy_processor import subscribe_market_data
from botbuilder.services.strategy_processor import subscribe_market_data
import asyncio
from deriv_api import DerivAPI

APP_ID = 61801


class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles WebSocket connection"""
        print("WebSocket connection attempt received")

        # Accept WebSocket connection
        await self.accept()

        # Hardcoded symbol (consider making this dynamic)
        symbol = "R_50"

        # Start subscription BEFORE adding to the group
        update_queue = asyncio.Queue()
        api = DerivAPI(app_id=APP_ID)

        # Start market data subscription
        asyncio.create_task(subscribe_market_data(api, symbol, update_queue, self.channel_layer))

        # Now add WebSocket to the group
        await self.channel_layer.group_add("market_data_group", self.channel_name)
        print("WebSocket connected and added to market_data_group")

    async def send_tick_data(self, event):
        """Sends tick data to WebSocket clients"""
        tick_data = event["tick_data"]
        print(f"Received tick data in consumer: {tick_data}")
        await self.send(json.dumps(tick_data))

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection"""
        await self.channel_layer.group_discard("market_data_group", self.channel_name)
        print("WebSocket disconnected")
'''
'''
class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        print("WebSocket connection attempt received")
        await self.accept()

        # Add this WebSocket to the group
        await self.channel_layer.group_add("market_data_group", self.channel_name)
        print("WebSocket connected and added to market_data_group")

        # Start subscription if not already active
        symbol = "R_50"  # Hardcoded symbol for now
        #if symbol not in active_subscriptions:
        # Shared queue for updates
        update_queue = asyncio.Queue()
        api = DerivAPI(app_id=APP_ID)
        asyncio.create_task(subscribe_market_data(api, symbol, update_queue))

    async def send_tick_data(self, event):
        # Send tick data to WebSocket clients
        tick_data = event["tick_data"]
        # Print the incoming tick data for debugging
        print(f"Received tick data in consumer: {tick_data}")
        await self.send(json.dumps(tick_data))

    async def disconnect(self, close_code):
        # Remove WebSocket from the group
        await self.channel_layer.group_discard("market_data_group", self.channel_name)
        print("WebSocket disconnected")
'''
'''
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from redis import StrictRedis


class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

        # Add this connection to the "market_data_group"
        await self.channel_layer.group_add("market_data_group", self.channel_name)
        print("WebSocket connection accepted and added to market_data_group")

    async def disconnect(self, close_code):
        # Remove this connection from the "market_data_group"
        await self.channel_layer.group_discard("market_data_group", self.channel_name)
        print("WebSocket disconnected", close_code)

    async def send_tick_data(self, event):
        """
        Send tick data to WebSocket clients in the group.
        """
        tick_data = event["tick_data"]

        # Print the incoming tick data for debugging
        print(f"Received tick data in consumer: {tick_data}")

        # Send the tick data to the WebSocket client
        await self.send(json.dumps(tick_data))
'''
'''
class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

        # Add this connection to the "market_data_group"
        await self.channel_layer.group_add("market_data_group", self.channel_name)
        print("WebSocket connection accepted and added to market_data_group")

    async def disconnect(self, close_code):
        # Remove this connection from the "market_data_group"
        await self.channel_layer.group_discard("market_data_group", self.channel_name)
        print("WebSocket disconnected", close_code)

    async def send_tick_data(self, event):
        """
        Send tick data to WebSocket clients in the group.
        """
        tick_data = event["tick_data"]
        await self.send(json.dumps(tick_data))
'''
'''
# Connect to Redis
redis_client = StrictRedis(host="localhost", port=6379, db=0, decode_responses=True)

class MarketDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept WebSocket connection
        await self.accept()
        self.channel_name = "market_data_channel"

        # Subscribe to the Redis channel
        self.pubsub = redis_client.pubsub()
        self.pubsub.subscribe(self.channel_name)

        # Start listening for Redis updates
        self.loop_task = asyncio.create_task(self.listen_to_redis())

    async def disconnect(self, close_code):
        # Cleanup when the connection is closed
        if hasattr(self, "loop_task"):
            self.loop_task.cancel()
        self.pubsub.unsubscribe(self.channel_name)

    async def listen_to_redis(self):
        try:
            for message in self.pubsub.listen():
                if message["type"] == "message":
                    # Send message data to the WebSocket client
                    await self.send(json.dumps(message["data"]))
        except asyncio.CancelledError:
            pass  # Task was canceled

    async def receive(self, text_data):
        # Handle incoming messages from the client if needed
        data = json.loads(text_data)
        print(f"Received from WebSocket client: {data}")

'''
'''
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class LiveDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "live_data"  # WebSocket group

        # Join the WebSocket group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the WebSocket group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_data(self, event):
        # Send data to WebSocket client
        data = event["data"]
        await self.send(text_data=json.dumps({"tick_data": data}))

'''
'''
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "live_data"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_data',
                'data': data
            }
        )

    async def send_data(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))
'''