'''
import asyncio

# Unbounded queues for tick and balance data
tick_data_queue = asyncio.Queue()
balance_data_queue = asyncio.Queue()



import janus

# Create janus queues (unbounded by default)
tick_data_queue = janus.Queue()
balance_data_queue = janus.Queue()
'''

'''
import janus

tick_data_queue = None
balance_data_queue = None

def setup_queues(loop):
    global tick_data_queue, balance_data_queue
    tick_data_queue = janus.Queue(loop=loop)
    balance_data_queue = janus.Queue(loop=loop)

'''
# shared/shared_q.py
import janus

class SharedQueues:
    def __init__(self):
        self.tick_data_queue = None
        self.buy_data_queue = None
        self.poc_data_queue = None
        self.balance_data_queue = None
        self.contracts_data_queue = None
        self.c_d_queue = None
        self.subscription_queues = {}

    async def init_queues(self):
        self.tick_data_queue = janus.Queue()
        self.buy_data_queue = janus.Queue()
        self.poc_data_queue = janus.Queue()
        self.balance_data_queue = janus.Queue()
        self.contracts_data_queue = janus.Queue()
        self.c_d_queue = janus.Queue()

    def create_subscription_queues(self, timeframes: dict) -> dict:
        key_to_queue_name = {}
        for label, key in timeframes.items():
            queue_name = f"{key}_queue"
            if queue_name not in self.subscription_queues:
                self.subscription_queues[queue_name] = janus.Queue()
                print(f"📦 Created queue: {queue_name}")
            else:
                print(f"⚠️ Queue already exists: {queue_name}")
            key_to_queue_name[key] = queue_name
        return key_to_queue_name

    def print_available_queues(self):
        print("\n📋 Available Queues:")
        for name in self.subscription_queues:
            print(f"🔹 {name}: {type(self.subscription_queues[name])}")

    def clear_subscription_queues(self):
        print("🧹 Clearing subscription queues...")
        for name, queue in self.subscription_queues.items():
            try:
                # Clear both async and sync sides
                while not queue.sync_q.empty():
                    queue.sync_q.get_nowait()
                print(f"🧼 Cleared queue: {name}")
            except Exception as e:
                print(f"❌ Error clearing queue {name}: {e}")
        self.subscription_queues.clear()
        print("✅ All queues cleared.")

    def clear_queue(self, queue_name: str):
        """
        Clear a single subscription queue by name (e.g. "R_50_1m_queue")
        """
        queue = self.subscription_queues.get(queue_name)
        if queue:
            try:
                while not queue.sync_q.empty():
                    queue.sync_q.get_nowait()
                print(f"🧼 Cleared queue: {queue_name}")
            except Exception as e:
                print(f"❌ Error clearing queue {queue_name}: {e}")
            # Optionally remove it completely
            del self.subscription_queues[queue_name]
        else:
            print(f"⚠️ Queue {queue_name} does not exist")

# Create global instance
shared_q = SharedQueues()

