'''
from django.apps import AppConfig
import asyncio
from ws.ws_manager import ws_manager  # Import WebSocket Manager

class WsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ws'
    def ready(self):
        """Start WebSocket when Django app initializes."""
        if not hasattr(self, '_websocket_started'):  # Prevent duplicate connections
            print("🚀 Starting WebSocket on Django startup...")
            self._websocket_started = True
            #asyncio.create_task(ws_manager.connect())
'''
from django.apps import AppConfig
import asyncio
import threading
from .ws_services import dc

class WsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ws'
'''
    def ready(self):
        # Run the async task in a new thread
        threading.Thread(target=self.run_async_task).start()

    def run_async_task(self):
        # Start an asyncio event loop in the new thread
        asyncio.run(dc.main())
'''


