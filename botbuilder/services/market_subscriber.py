from ws.ws_services.subscription_registry import (
    is_subscribed, mark_subscribed,
    is_tick_subscribed, mark_tick_subscribed,
    remove_tick_subscription, remove_candle_subscription
)
from ws.ws_services.redis_conn import (
    is_already_subscribed, get_subscription, store_subscription, add_subscription_mappin
)


class MarketSubscriptionManager:
    def __init__(self, websocket, client_id):
        print("📦 Initializing MarketSubscriptionManager...")
        self.websocket = websocket
        self.client_id = client_id
        self.req_counter = 1000

    def get_next_req_id(self):
        self.req_counter += 1
        return self.req_counter

    async def subscribe(self, queue_map: dict) -> dict:
        subscription_info = {}

        for key, queue_name in queue_map.items():
            if "_" not in key:
                print(f"⚠️ Invalid subscription key format: {key}")
                continue

            symbol, tf = key.rsplit("_", 1)

            # Check Redis cache
            if await is_already_subscribed(self.client_id, key):
                cached = await get_subscription(self.client_id, key)
                print(f"✅ Using cached subscription for {key} → {cached}")
                subscription_info[key] = cached
                continue

            # Generate new req_id and subscribe
            req_id = self.get_next_req_id()

            if tf == "tickh":
                if not is_subscribed(symbol, "tick"):
                    print(f"🕰️ Subscribing to histori cal ticks for {symbol} (req_id: {req_id})")
                    await self.websocket.subscribe_candlestick_data(symbol, "tick", req_id=req_id)
                    mark_subscribed(symbol, "tick")

            elif tf == "tickl":
                if not is_tick_subscribed(symbol):
                    print(f"📡 Subscribing to live ticks for {symbol} (req_id: {req_id})")
                    await self.websocket.subscribe_ticks(symbol, req_id=req_id)
                    mark_tick_subscribed(symbol)

            else:
                if not is_subscribed(symbol, tf):
                    print(f"📈 Subscribing to {symbol} candles @ {tf} (req_id: {req_id})")
                    await self.websocket.subscribe_candlestick_data(symbol, tf, req_id=req_id)
                    mark_subscribed(symbol, tf)

            # Store in Redis
            metadata = {
                "queue": queue_name,
                "req_id": req_id
            }
            await store_subscription(self.client_id, key, metadata)
            subscription_info[key] = metadata

        return subscription_info
