from django.apps import AppConfig
import asyncio
import threading
#from .services import connection

class BotbuilderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'botbuilder'

    #def ready(self):
        # Run the async task in a new thread
     #   threading.Thread(target=self.run_async_task).start()

    #def run_async_task(self):
        # Start an asyncio event loop in the new thread
        #asyncio.run(connection.sample_calls())



