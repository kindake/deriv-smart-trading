from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import redis

# Initialize Redis client
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0, decode_responses=True)

def broadcast_live_data():
    """
    Listen to the Redis channel and forward data to WebSocket group.
    """
    pubsub = await redis_client.pubsub()
    pubsub.subscribe("market_data_channel")  # Subscribe to the Redis channel

    channel_layer = get_channel_layer()

    print("Listening to Redis channel for market data...")

    # Consume messages from Redis
    for message in pubsub.listen():
        if message["type"] == "message":
            tick_data = message["data"]  # Extract tick data JSON

            # Broadcast to WebSocket group
            async_to_sync(channel_layer.group_send)(
                "live_data",  # WebSocket group name
                {
                    "type": "send_data",  # Event type in WebSocket consumer
                    "data": tick_data     # JSON data from Redis
                }
            )



'''
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_live_data(data_stream):
    """
    Streams live data to the WebSocket group as it arrives.
    """
    channel_layer = get_channel_layer()

    for data in data_stream:
        async_to_sync(channel_layer.group_send)(
            "live_data",  # WebSocket group name
            {
                "type": "send_data",
                "data": data
            }
        )

'''
'''
import asyncio
from deriv_api import DerivAPI
from .models import Bot, Trade

async def execute_bot(bot_id):
    bot = Bot.objects.get(id=bot_id)
    api = DerivAPI(endpoint='wss://ws.binaryws.com/websocket/v3?app_id=1234')
    await api.authorize('your_api_token')

    # Interpret and execute the bot configuration
    bot_config = eval(bot.configuration)

    proposal_params = bot_config.get('proposal_params', {})
    amount = proposal_params.get('amount', 100)
    symbol = proposal_params.get('symbol', 'R_100')
    duration = proposal_params.get('duration', 60)
    duration_unit = proposal_params.get('duration_unit', 's')
    contract_type = proposal_params.get('contract_type', 'CALL')
    currency = proposal_params.get('currency', 'USD')
    barrier = proposal_params.get('barrier', '+0.1')

    proposal = await api.proposal({
        "proposal": 1,
        "amount": amount,
        "barrier": barrier,
        "basis": "payout",
        "contract_type": contract_type,
        "currency": currency,
        "duration": duration,
        "duration_unit": duration_unit,
        "symbol": symbol
    })
    proposal_id = proposal.get('proposal').get('id')
    buy = await api.buy({"buy": proposal_id, "price": amount})
    print(buy)
'''
    # Record the trade in the database
    #Trade.objects.create(
     #   bot=bot,
      #  trade_id=buy.get('buy').get('contract_id'),
       # amount=amount,
        #profit=buy.get('buy').get('profit'),
        #status=buy.get('buy').get('status')
        #)
