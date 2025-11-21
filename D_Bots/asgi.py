import os
import asyncio
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from ws.routing import websocket_urlpatterns
import shared.shared_q as shared_q

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "D_Bots.settings")

django_asgi_app = get_asgi_application()

# --- Health check middleware (Render) ---
async def health_check(scope, receive, send):
    if scope["type"] != "http":
        # Non-HTTP (like WebSockets) → handled by Channels
        await django_asgi_app(scope, receive, send)
        return

    # Only intercept /health/, not /
    if scope["path"] == "/health/":
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": [(b"content-type", b"application/json")],
        })
        await send({
            "type": "http.response.body",
            "body": b'{"status": "ok"}',
        })
        return

    # Let all other HTTP (including "/") go to Django
    await django_asgi_app(scope, receive, send)


# --- Main ASGI application ---
application = ProtocolTypeRouter({
    "http": health_check,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

'''
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from ws.routing import websocket_urlpatterns  # Import WebSocket URLs
from channels.auth import AuthMiddlewareStack
import shared.shared_q as shared_q
import asyncio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'D_Bots.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
'''
'''
import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from ws.routing import websocket_urlpatterns  # Import WebSocket URLs
from channels.auth import AuthMiddlewareStack
import shared.shared_q as shared_q
import asyncio
from django.urls import path
from django.http import JsonResponse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'D_Bots.settings')
django.setup()

# ✅ Simple /health/ endpoint for Render health check
async def health_check(scope, receive, send):
    if scope["type"] == "http":
        response = JsonResponse({"status": "ok"})
        await response(scope, receive, send)


# ✅ ASGI application
application = ProtocolTypeRouter({
    "http": URLRouter([
        path("health/", health_check),  # <-- Render health check path
        path("", get_asgi_application()),  # <-- Normal Django routes
    ]),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
'''
'''
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
'''
