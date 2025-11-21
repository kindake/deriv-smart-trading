# charts/services/chart_processor.py
import json
from ws.ws_services.subscription_registry import is_subscribed, mark_subscribed
from botbuilder.services.market_subscriber import MarketSubscriptionManager
from shared.shared_q import shared_q
import asyncio
from ws.ws_services.socket_registry import register_socket, has_socket, get_socket, update_task, get_task
from ws.ws_services.subscription_registry import (
    is_subscribed, mark_subscribed,
    is_tick_subscribed, mark_tick_subscribed,
    remove_tick_subscription, remove_candle_subscription,
)
from ws.ws_services.redis_conn import (
    is_already_subscribed, get_subscription, store_subscription,
    add_subscription_mappin, get_all_subscriptions, set_bot_live_status,
    get_bot_live_status, get_subscription_mappin,
    #delete_all_subscriptions,
    set_chart_live_status, get_chart_live_status, remove_matching_subscriptions, remove_subs
)

def build_chart_timeframe_dict(symbol: str, timeframe: str) -> dict:
    """
    Build a timeframe dictionary for charts that always includes live ticks.

    Example:
        Input: symbol="R_50", timeframe="1m"
        Output:
        {
            "tfrc": "R_50_tickl",   # Always included
            "tfr1": "R_50_1m"       # User-selected timeframe
        }
    """
    tf_dict = {
        "tfrc": f"{symbol}_tickl",   # Constant live tick data
        "tfr1": f"{symbol}_{timeframe}"  # User-specific timeframe
    }
    return tf_dict


def create_indicator_queues(subscription_result):
    unique_keys = set()

    for key in subscription_result.keys():
        if "tick" in key:
            unique_keys.add("tick")
        else:
            try:
                tf_part = key.split("_")[-1]
                unique_keys.add(tf_part)
            except IndexError:
                print(f"⚠️ Failed to parse timeframe from key: {key}")

    indicator_queues = {}
    for key in unique_keys:
        indicator_queues[key] = asyncio.Queue()
        print(f"📦 Created indicator queue: {key}")

    return indicator_queues

def get_queues_for_key(key, subscription_result):
    queues = []

    for sub_key, value in subscription_result.items():
        if sub_key.endswith("tickl") or sub_key.endswith("tickh"):
            if key == "tick":
                qname = value["queue"]
                queue = shared_q.subscription_queues.get(qname)
                if queue:
                    queues.append(queue)
        elif sub_key.endswith(key):
            qname = value["queue"]
            queue = shared_q.subscription_queues.get(qname)
            if queue:
                queues.append(queue)

    return queues


async def p_l_tick_data(queues, key, d_sub, client_id):

    async def listen_queue(queue):
        #nonlocal tick_data
        print(f"🚦 Listening to queue: {queue}")
        while True:
            try:
                #data = await queue.async_q.get()
                try:
                    print(f"⏳ Waiting for data from queue: {queue}")
                    data = await queue.async_q.get()
                    print(f"📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥 Received data from queue ({queue=}):\n{data}")
                except Exception as e:
                    print(f"❌❌❌❌❌❌❌❌❌❌❌❌v❌ Error while getting data from queue: {e}")

                # 🔗 Track subscription mapping
                if "subscription" in data and "req_id" in data:
                    sub_id = data["subscription"]["id"]
                    req_id = data["req_id"]
                    if req_id not in d_sub:
                        d_sub[req_id] = sub_id
                        print(f"🔗 Mapped req_id {req_id} → subscription_id {sub_id}")

                        # 🚀 Save to Redis
                        await add_subscription_mappin("chart", client_id, req_id, sub_id)

                        # ✅ Mark bot/chart live
                        await set_chart_live_status(client_id, status=True)
            except Exception as e:
                print(f"❌ Queue listen error: {e}")
                continue

    print("👀 Starting listeners for queues:", queues)
    print("🔍 Queues passed to p_l_tick_data:", queues)
    await asyncio.gather(*(listen_queue(q) for q in queues))

async def run_streaming_task(key, subscription_result, d_sub, client_id):
    print(f"🚀 Starting streaming task for {key}")  # 🔍 Confirm task launch

    while True:
        try:
            print(f"🧪 Inside loop for {key}")  # 🔍 Confirm we're looping

            queues = get_queues_for_key(key, subscription_result)
            print(f"📦 Queues for {key} resolved:", queues)

            await p_l_tick_data(
                queues, key, d_sub, client_id
            )  # ✅ Pass key string

            print(f"🔁🔁 Streaming continues for {key} 🔁🔁")

        except Exception as e:
            print(f"❌ Error in streaming task for {key}: {e}")

            await asyncio.sleep(5)

async def unsubscribe_all(websocket, d_sub):
    print("🔁 Unsubscribing from all active subscriptions...")
    print("📦 Current d_sub contents:", d_sub)

    for req_id, sub_id in d_sub.items():
        if sub_id:
            try:
                await websocket.ws.send(json.dumps({
                    "forget": sub_id,
                    "req_id": req_id
                }))
                print(f"🧹 Unsubscribed (req_id: {req_id}, sub_id: {sub_id})")
            except Exception as e:
                print(f"❌ Failed to unsubscribe (req_id: {req_id}): {e}")
        else:
            print(f"⚠️ Missing subscription ID for req_id: {req_id}")

    print("✅ All subscriptions successfully forgotten.")

async def handle_chart_subscription(symbol, timeframe, client_id):
    """
    Responsible for:
    ✅ Building timeframe dict
    ✅ Creating shared queues
    ✅ Subscribing if not already
    ✅ Handling cleanup in finally block
    """
    print("📊 Chart initializing subscription...")

    socket_entry = get_socket(client_id)
    if not socket_entry or not socket_entry.get("websocket"):
        print(f"❌ No websocket found for client {client_id}")
        return

    websocket = socket_entry["websocket"]

    # Setup
    timeframes = build_chart_timeframe_dict(symbol, timeframe)
    running_tasks = []
    d_sub = {}

    try:
        # Create queues
        queue_map = shared_q.create_subscription_queues(timeframes)
        print("🧭 Queue Map:", queue_map)
        shared_q.print_available_queues()

        print(f"🧩 Websocket passed into chart subscription: {websocket!r}")
        msm = MarketSubscriptionManager(websocket, client_id)
        tf_key = f"{symbol}_{timeframe}"

        if not is_subscribed(symbol, timeframe):
            print(f"📡 Chart subscribing to {tf_key}")
            subscription_result = await msm.subscribe(queue_map)

            # ✅ Create indicator queues
            indicator_queues = create_indicator_queues(subscription_result)

            # ✅ Launch streaming tasks
            for tf in indicator_queues:
                task_name = f"{tf}_stream_task"
                task = asyncio.create_task(
                    run_streaming_task(tf, subscription_result, d_sub, client_id),
                    name=task_name
                )
                running_tasks.append(task)
                print(f"🚀 Started streaming task for: {tf}")

            mark_subscribed(symbol, timeframe)
        else:
            print(f"✅ Already subscribed to {tf_key}")

        # 🌟 Keep alive loop if needed
        while True:
            await asyncio.sleep(1)

    except asyncio.CancelledError:
        # Raised if someone calls task.cancel()
        print(f"🛑 Chart task for {client_id} was manually cancelled.")
        raise  # <-- re-raise so finally block executes

    except Exception as e:
        print(f"⚠️ Chart task crashed for {client_id}: {e}")

    finally:
        # 🔥 This ALWAYS runs (cancel, error, or normal finish)
        print(f"🔚 Entered finally block for client_id: {client_id}")
        print("🛑 Cancelling all running tasks...")
        for task in running_tasks:
            task.cancel()
        await asyncio.gather(*running_tasks, return_exceptions=True)

        try:
            bot_is_live = await get_bot_live_status(client_id)
            if bot_is_live:
                print(f" 🤖 bot is still live for {client_id} — checking subscriptions...")
                bot_map = await get_subscription_mappin("bot", client_id)
                print(f"📌 Redis req_id → sub_id map for bot client {client_id}: {bot_map}")
                all_subs = await get_all_subscriptions(client_id)
                print(f"📦 All chart subscriptions for {client_id}: {all_subs}")
                try:
                    await slim_d_sub(d_sub, bot_map)
                except Exception as e:
                    print(f"⚠️ Error in slim_d_sub for chart: {e}")
            else:
                print(f"📉 Chart is not live for {client_id}. Proceeding to unsubscribe...")
        except Exception as e:
            print(f"⚠️ Error checking chart live status: {e}")

        if await get_chart_live_status(client_id):
            chart_map = await get_subscription_mappin("chart", client_id)
            print(f"📌 Redis req_id → sub_id map for chart client {client_id}: {chart_map}")
        else:
            print(f"❌ Bot client {client_id} is not live.")

        # ✅ Unsubscribe from everything
        try:
            all_subs = await get_all_subscriptions(client_id)
            print(f"📦 All subscriptions for {client_id}: {all_subs}")

            await unsubscribe_all(websocket, d_sub)
            shared_q.print_available_queues()
            await clear_matching_queues(client_id, d_sub)
            await remove_matching_subscriptions(client_id, d_sub)
            await clean_subs_using_dsub_and_allsubs(d_sub, all_subs, client_id, do_clear=True)

            d_sub.clear()

        except Exception as e:
            print(f"⚠️ Error during full unsubscription: {e}")

        shared_q.print_available_queues()
        await clear_matching_queues(client_id, d_sub)
        d_sub.clear()

        print(f"🧹 Finished cleanup for client_id: {client_id}")

async def clean_subs_using_dsub_and_allsubs(d_sub, all_subs, client_id, do_clear=False):
    print("\n🧹 Cleaning registry based on d_sub and all_subs mapping...\n")

    for d_req_id in d_sub.keys():
        found = False

        for key, val in all_subs.items():
            req_id_in_all = val.get("req_id")
            if req_id_in_all != d_req_id:
                continue  # skip non-matching

            found = True
            print(f"🔍 Matched req_id {d_req_id} → key: {key}")

            if "_" not in key:
                print(f"⚠️ Invalid format (missing '_') in key: {key}")
                continue

            symbol, timeframe = key.split("_", 1)

            # ✅ Case 1: tickl → use is_tick_subscribed
            if timeframe == "tickl":
                if is_tick_subscribed(symbol):
                    print(f"✅ Tick (low freq) is subscribed: {symbol}")
                    if do_clear:
                        remove_tick_subscription(symbol)
                        print(f"🧹 Removed tick (low freq): {symbol}")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Tick (low freq) not in registry: {symbol}")

            # ✅ Case 2: tickh → check with is_subscribed(symbol, "tick")
            elif timeframe == "tickh":
                if is_subscribed(symbol, "tick"):
                    print(f"✅ Tick (high freq) is subscribed: {symbol}_tick")
                    if do_clear:
                        remove_candle_subscription(symbol, "tick")
                        print(f"🧹 Removed tick (high freq): {symbol}_tick")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Tick (high freq) not in registry: {symbol}_tick")

            # ✅ Case 3: any other candle timeframe (e.g., "1m", "5m")
            else:
                if is_subscribed(symbol, timeframe):
                    print(f"✅ Candle is subscribed: {symbol}_{timeframe}")
                    if do_clear:
                        remove_candle_subscription(symbol, timeframe)
                        print(f"🧹 Removed candle: {symbol}_{timeframe}")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Candle not in registry: {symbol}_{timeframe}")

            print("")

        if not found:
            print(f"❓ No match found in all_subs for d_sub req_id {d_req_id}")

    print("✅ Cleanup process complete.\n")


def print_subscription_debug_info(d_sub, all_subs):
    print("\n🧩 Debugging Subscription Maps...")

    print("\n📦 d_sub (req_id → sub_id):")
    if not d_sub:
        print("  🚫 No entries in d_sub")
    else:
        for req_id, sub_id in d_sub.items():
            print(f"  🔑 {req_id} → {sub_id}")

    print("\n📦 all_subs (req_id → subscription details):")
    if not all_subs:
        print("  🚫 No entries in all_subs")
    else:
        for req_id, details in all_subs.items():
            print(f"  🔍 {req_id}:")
            for key, val in details.items():
                print(f"     {key}: {val}")

    print("\n✅ End of subscription debug info.\n")

def print_and_clean_subscriptions(d_sub, all_subs, do_clear=False):
    """
    d_sub: dict of req_id → sub_id
    all_subs: dict of req_id → {symbol, type, timeframe}
    do_clear: if True, it will also remove them from registry
    """
    print("🔎 Checking current tracked subscriptions...\n")

    print_subscription_debug_info(d_sub, all_subs)

    for req_id, sub_id in d_sub.items():
        sub_data = all_subs.get(req_id)

        if not sub_data:
            print(f"❓ No sub info found for req_id {req_id}")
            continue

        symbol = sub_data.get("symbol")
        sub_type = sub_data.get("type")  # "tick" or "candlestick"
        tf = sub_data.get("timeframe", "")

        print(f"🔑 {req_id}: {symbol} ({sub_type}, {tf})")

        if sub_type == "tick":
            if is_tick_subscribed(symbol):
                print(f"✅ Tick is subscribed: {symbol}")
                if do_clear:
                    remove_tick_subscription(symbol)
                    print(f"🧹 Removed tick subscription: {symbol}")
            else:
                print(f"❌ Tick NOT found in registry: {symbol}")

        elif sub_type == "candlestick":
            if is_subscribed(symbol, tf):
                print(f"✅ Candle is subscribed: {symbol}_{tf}")
                if do_clear:
                    remove_candle_subscription(symbol, tf)
                    print(f"🧹 Removed candle subscription: {symbol}_{tf}")
            else:
                print(f"❌ Candle NOT found in registry: {symbol}_{tf}")

        print("")

    print("✅ Subscription registry cleanup done.\n")


async def clear_matching_queues(client_id, d_sub):
    """
    Clears queues in `shared_instance` that are associated with active d_sub entries.

    - client_id: str → used to fetch all subscriptions
    - d_sub: dict → req_id: sub_id mapping from live WebSocket session
    - shared_instance: object → must have `.clear_queue(queue_name)` method
    """
    all_subs = await get_all_subscriptions(client_id)  # Get all Redis-stored subs for client

    print(f"📦 All subscriptions for {client_id}:")
    for key, val in all_subs.items():
        print(f"  🔑 {key} → {val}")

    print("🧠 Cross-referencing with d_sub to find matching queues...")
    for sub_key, sub_info in all_subs.items():
        req_id = sub_info.get("req_id")
        queue_name = sub_info.get("queue")

        if req_id in d_sub:
            print(f"🧹 Clearing queue: {queue_name} (req_id: {req_id})")
            shared_q.clear_queue(queue_name)
        else:
            print(f"⏭️ Skipping {queue_name} (req_id: {req_id}) — not in d_sub")


def slim_d_sub(d_sub: dict, chart_map: dict) -> dict:
    cleaned_d_sub = {
        req_id: sub_id
        for req_id, sub_id in d_sub.items()
        if chart_map.get(req_id) != sub_id
    }

    removed = set(d_sub) - set(cleaned_d_sub)
    if removed:
        print(f"🧹 Removed redundant req_ids from d_sub: {removed}")

    return cleaned_d_sub

