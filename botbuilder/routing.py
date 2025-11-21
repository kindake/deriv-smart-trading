from django.urls import re_path
from botbuilder.consumers import MarketDataConsumer
from django.urls import path

websocket_urlpatterns = [
    re_path(r'ws/m-data/$', MarketDataConsumer.as_asgi()),
]

'''
from django.urls import re_path
from .consumers import MarketDataConsumer

websocket_urlpatterns = [
    #re_path(r'ws/m-data/', MarketDataConsumer.as_asgi()),
    re_path(r'ws/m-data/$', MarketDataConsumer.as_asgi()),
]
'''
'''
from django.urls import re_path
from .consumers import MarketDataConsumer

websocket_urlpatterns = [
    re_path(r'ws/m-data/', MarketDataConsumer.as_asgi()),
]
'''

'''
from django.urls import re_path
# from .consumers import LiveDataConsumer
from django.urls import path
from .consumers import MarketDataConsumer
from botbuilder.consumers import MarketDataConsumer

websocket_urlpatterns = [
    path('ws/m-data/', MarketDataConsumer.as_asgi()),
]

'''
'''
websocket_urlpatterns = [
    re_path(r"ws/market-data/$", LiveDataConsumer.as_asgi()),  # WebSocket endpoint
]
'''
'''
from django.urls import path
from . import consumers  # Import WebSocket consumers

websocket_urlpatterns = [
    path('ws/data/', consumers.DataConsumer.as_asgi()),  # WebSocket endpoint
]
'''