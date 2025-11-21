# ws/ws_services/subscription_registry.py

subscription_registry = {
    "ticks": set(),
    "candles": set()
}

def is_subscribed(symbol, tf):
    return f"{symbol}_{tf}" in subscription_registry["candles"]

def mark_subscribed(symbol, tf):
    subscription_registry["candles"].add(f"{symbol}_{tf}")

def is_tick_subscribed(symbol):
    return symbol in subscription_registry["ticks"]

def mark_tick_subscribed(symbol):
    subscription_registry["ticks"].add(symbol)

# Remove specific candle subscription
def remove_candle_subscription(symbol, tf):
    key = f"{symbol}_{tf}"
    subscription_registry["candles"].discard(key)  # discard avoids KeyError

# Remove specific tick subscription
def remove_tick_subscription(symbol):
    subscription_registry["ticks"].discard(symbol)
