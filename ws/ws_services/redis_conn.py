# ws/ws_services/redis_conn.py
import os
import json
import redis.asyncio as aioredis
from typing import Optional, Dict
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

REDIS_URL = os.environ.get("REDIS_URL")
if not REDIS_URL:
    raise RuntimeError("REDIS_URL is not set")

# Global async Redis client
redis_client = aioredis.from_url(REDIS_URL, decode_responses=True)

# ============================================================
# 🌐 CONNECTION STATUS
# ============================================================
async def set_connection_status(client_id: str, status: str = "connected", ttl_seconds: int = 3600):
    await redis_client.set(f"ws_connection:{client_id}", status, ex=ttl_seconds)

async def get_connection_status(client_id: str) -> Optional[str]:
    return await redis_client.get(f"ws_connection:{client_id}")

async def delete_connection_status(client_id: str):
    await redis_client.delete(f"ws_connection:{client_id}")

# ============================================================
# 🤖 BOT / CHART STATUS
# ============================================================
async def set_bot_live_status(client_id: str, status: bool, ttl_seconds: int = 86400):
    await redis_client.set(f"client:{client_id}:bot_status", json.dumps(status), ex=ttl_seconds)

async def get_bot_live_status(client_id: str) -> bool:
    val = await redis_client.get(f"client:{client_id}:bot_status")
    return json.loads(val) if val else False

async def set_chart_live_status(client_id: str, status: bool, ttl_seconds: int = 86400):
    await redis_client.set(f"client:{client_id}:chart_status", json.dumps(status), ex=ttl_seconds)

async def get_chart_live_status(client_id: str) -> bool:
    val = await redis_client.get(f"client:{client_id}:chart_status")
    return json.loads(val) if val else False

# ============================================================
# 🕒 TIMEFRAMES
# ============================================================
async def set_timeframes(client_id: str, timeframes_dict: dict, ttl_seconds: int = 86400):
    await redis_client.set(f"client:{client_id}:timeframes", json.dumps(timeframes_dict), ex=ttl_seconds)

async def get_timeframes(client_id: str):
    val = await redis_client.get(f"client:{client_id}:timeframes")
    return json.loads(val) if val else None

async def delete_timeframes(client_id: str):
    await redis_client.delete(f"client:{client_id}:timeframes")

# ============================================================
# 🔑 TOKEN MANAGEMENT
# ============================================================
async def set_tokens(client_id: str, real_token: Optional[str] = None, demo_token: Optional[str] = None, ttl_seconds: int = 7*24*3600):
    key = f"client:{client_id}:tokens"
    mapping = {}
    if real_token:
        mapping["real"] = real_token
    if demo_token:
        mapping["demo"] = demo_token
    if mapping:
        await redis_client.hset(key, mapping=mapping)
        await redis_client.expire(key, ttl_seconds)

async def get_tokens(client_id: str) -> Dict[str, str]:
    return await redis_client.hgetall(f"client:{client_id}:tokens")

async def delete_tokens(client_id: str):
    await redis_client.delete(f"client:{client_id}:tokens")

# ============================================================
# 📊 META INFO
# ============================================================
async def set_meta(client_id: str, mapping: dict, ttl_seconds: int = 7*24*3600):
    key = f"client:{client_id}:meta"
    await redis_client.hset(key, mapping=mapping)
    await redis_client.expire(key, ttl_seconds)

async def get_meta(client_id: str) -> dict:
    return await redis_client.hgetall(f"client:{client_id}:meta")

# ============================================================
# ⚡ SUBSCRIPTIONS
# ============================================================
def _get_key(client_id: str):
    return f"subscription:{client_id}"

async def store_subscription(client_id: str, key: str, metadata: dict):
    await redis_client.hset(_get_key(client_id), key, json.dumps(metadata))

async def get_subscription(client_id: str, key: str):
    raw = await redis_client.hget(_get_key(client_id), key)
    return json.loads(raw) if raw else None

async def get_all_subscriptions(client_id: str):
    raw_dict = await redis_client.hgetall(_get_key(client_id))
    return {k: json.loads(v) for k, v in raw_dict.items()} if raw_dict else {}

async def is_already_subscribed(client_id: str, key: str):
    return await redis_client.hexists(_get_key(client_id), key)

async def remove_subs(client_id: str, sub_key: str):
    removed = await redis_client.hdel(_get_key(client_id), sub_key)
    if removed:
        print(f"🧹 Removed Redis subscription: {sub_key} for client_id: {client_id}")
    else:
        print(f"⚠️ No Redis subscription found for: {sub_key} (client_id: {client_id})")

async def clear_all_subscriptions(client_id: str):
    await redis_client.delete(_get_key(client_id))

async def get_subs_to_remove(all_subs: dict, d_sub: dict):
    return [key for key, value in all_subs.items() if value.get("req_id") not in d_sub]

async def remove_matching_subscriptions(client_id: str, d_sub: dict):
    all_subs = await get_all_subscriptions(client_id)
    subs_to_remove = await get_subs_to_remove(all_subs, d_sub)
    for key in subs_to_remove:
        await redis_client.hdel(_get_key(client_id), key)
        print(f"❌ Removed subscription: {key} for client: {client_id}")

# ============================================================
# ⚡ REQ_ID → SUB_ID MAPPING (BOT/CHART)
# ============================================================
async def add_subscription_mappin(client_type: str, client_id: str, req_id: str, sub_id: str):
    key = f"{client_type}:{client_id}:subscriptions"
    current = await redis_client.get(key)
    mapping = json.loads(current) if current else {}
    mapping[str(req_id)] = sub_id
    await redis_client.set(key, json.dumps(mapping))
    print(f"🧩 Stored {client_type} subscription {req_id} → {sub_id} for {client_id}")

async def get_subscription_mappin(client_type: str, client_id: str) -> dict:
    key = f"{client_type}:{client_id}:subscriptions"
    current = await redis_client.get(key)
    return json.loads(current) if current else {}

async def remove_subscription_mappin(client_type: str, client_id: str, req_id: str):
    key = f"{client_type}:{client_id}:subscriptions"
    current = await redis_client.get(key)
    if not current:
        return
    mapping = json.loads(current)
    mapping.pop(str(req_id), None)
    await redis_client.set(key, json.dumps(mapping))
    print(f"❌ Removed subscription for req_id {req_id} from {client_type}:{client_id}")

async def clear_all_subscriptio(client_type: str, client_id: str):
    key = f"{client_type}:{client_id}:subscriptions"
    await redis_client.delete(key)
    print(f"🗑️ Cleared all subscriptions for {client_type}:{client_id}")
