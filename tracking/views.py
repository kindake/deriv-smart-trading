# tracking/views.py
import json
import uuid
import asyncio
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import async_to_sync

# Your existing imports
from tutorials.services.chart_processor import handle_chart_subscription
from ws.ws_services.socket_registry import (
    register_socket, has_socket, get_socket,
    update_task, get_task
)

# ✅ Import Redis + encryption helpers
from ws.ws_services.redis_conn import set_tokens, get_tokens, set_meta
from ws.ws_services.crypto_utils import encrypt_token, decrypt_token


# ============================================================
# 1️⃣ Existing Client Event Handler (leave this as is)
# ============================================================
@csrf_exempt
def client_events(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("📩 Client Event:", data)

            # Extract
            event_type = data.get("event_type")
            client_id = data.get("client_id")

            # Handle close event
            if event_type == "close_charts" and client_id:
                # ✅ Safely run async inside sync view
                async_to_sync(close_chart_task)(client_id)

            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)


# ============================================================
# 2️⃣ Token Storage Endpoint
# ============================================================
@csrf_exempt
def store_tokens(request):
    """
    Accepts a POST from the frontend with Deriv tokens & account info.
    Stores them encrypted in Redis and saves metadata.
    Returns client_id and masked tokens.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        # Parse incoming JSON
        payload = json.loads(request.body.decode() if isinstance(request.body, bytes) else request.body)
        print("📩 [store_tokens] Received payload:", payload)

        # Prefer provided client_id, else generate one
        client_id = payload.get("client_id") or str(uuid.uuid4())
        print(f"🔎 [store_tokens] client_id = {client_id}")

        # Extract token/account data
        api_token = payload.get("api_token") or payload.get("token1")
        demo_token = payload.get("demo_token") or payload.get("token2")
        accounts = payload.get("accounts") or {}
        lang = payload.get("lang") or payload.get("language") or "EN"

        # Encrypt tokens before storing
        enc_api = encrypt_token(api_token) if api_token else None
        enc_demo = encrypt_token(demo_token) if demo_token else None
        print(f"🔐 [store_tokens] Encrypting tokens for {client_id} (real={bool(api_token)}, demo={bool(demo_token)})")

        # Store encrypted tokens (async helper)
        async_to_sync(set_tokens)(client_id, real_token=enc_api, demo_token=enc_demo, ttl_seconds=7*24*3600)
        print(f"✅ [store_tokens] Tokens stored for {client_id}")

        # Store metadata (account info)
        meta_map = {
            "lang": lang,
            "real_id": (accounts.get("real") or {}).get("id", ""),
            "real_currency": (accounts.get("real") or {}).get("currency", ""),
            "demo_id": (accounts.get("demo") or {}).get("id", ""),
            "demo_currency": (accounts.get("demo") or {}).get("currency", "")
        }
        async_to_sync(set_meta)(client_id, mapping=meta_map, ttl_seconds=7*24*3600)
        print(f"✅ [store_tokens] Meta stored for {client_id}: {meta_map}")

        # Read back stored tokens from Redis to confirm
        stored = async_to_sync(get_tokens)(client_id)

        # Convert possible byte keys/values to str
        def _decode_map(m):
            try:
                return {
                    (k.decode() if isinstance(k, bytes) else k):
                    (v.decode() if isinstance(v, bytes) else v)
                    for k, v in m.items()
                }
            except Exception:
                return m

        stored_decoded = _decode_map(stored or {})

        # Mask tokens before printing/logging
        def _mask(s):
            if not s:
                return None
            s = str(s)
            if len(s) <= 10:
                return s[:3] + "..."
            return s[:6] + "..." + s[-4:]

        masked = {
            k: (_mask(v) if k in ("real", "demo") or "token" in k else v)
            for k, v in stored_decoded.items()
        }

        print(f"🔍 [store_tokens] Stored (encrypted) Redis tokens for {client_id}: {masked}")

        return JsonResponse({"ok": True, "client_id": client_id, "tokens": masked})

    except Exception as e:
        print(f"❌ [store_tokens] Error: {e}", flush=True)
        return JsonResponse({"error": str(e)}, status=500)


# ============================================================
# 3️⃣ Async Helper — already working for charts
# ============================================================
async def close_chart_task(client_id: str):
    print("🧹 Closing chart subscription for client:", client_id)

    chart_task = get_task(client_id, "chart_task")
    print("🔍 Retrieved chart_task:", chart_task)

    if chart_task is None:
        print("⚠️ No active chart task found to cancel.")
        return  # nothing to do

    try:
        print("🚦 Chart task state before cancel:", chart_task.done(), chart_task.cancelled())
        chart_task.cancel()
        await chart_task  # Raises CancelledError if actively cancelled
        print("✅ Chart task finished or already done.")
    except asyncio.CancelledError:
        print("📉 Chart task was cancelled successfully.")
    finally:
        print("🚦 Chart task state after cancel:", chart_task.done(), chart_task.cancelled())
        update_task(client_id, "chart_task", None)

'''

# tracking/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import asyncio
from asgiref.sync import async_to_sync

from tutorials.services.chart_processor import handle_chart_subscription
from ws.ws_services.socket_registry import (
    register_socket, has_socket, get_socket,
    update_task, get_task
)


@csrf_exempt
def client_events(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("📩 Client Event:", data)

            # Extract
            event_type = data.get("event_type")
            client_id = data.get("client_id")

            # Handle close event
            if event_type == "close_charts" and client_id:
                # ✅ Safely run async inside sync view
                async_to_sync(close_chart_task)(client_id)

            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)


# -----------------------------
# Async helper
# -----------------------------
# -----------------------------
# Async helper
# -----------------------------
async def close_chart_task(client_id: str):
    print("🧹 Closing chart subscription for client:", client_id)

    chart_task = get_task(client_id, "chart_task")
    print("🔍 Retrieved chart_task:", chart_task)

    if chart_task is None:
        print("⚠️ No active chart task found to cancel.")
        return  # nothing to do

    # At this point, we have a valid task
    try:
        print("🚦 Chart task state before cancel:",
              chart_task.done(), chart_task.cancelled())
        chart_task.cancel()

        await chart_task  # this will raise CancelledError if actively cancelled

        print("✅ Chart task finished without CancelledError (maybe already done).")
    except asyncio.CancelledError:
        print("📉 Chart task was cancelled successfully.")
    finally:
        print("🚦 Chart task state after cancel:",
              chart_task.done(), chart_task.cancelled())
        update_task(client_id, "chart_task", None)

'''
