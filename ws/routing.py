from django.urls import re_path
from ws.consumers import TickDataConsumer

websocket_urlpatterns = [
    re_path(r"ws/ticks/$", TickDataConsumer.as_asgi()),
]
