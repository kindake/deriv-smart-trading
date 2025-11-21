# test_redis.py
import os
from dotenv import load_dotenv
import redis

# Load environment variables from .env
load_dotenv()

# Get Redis URL from .env
redis_url = os.environ.get("REDIS_URL")
print("Redis URL:", redis_url)

# Connect and test Redis
r = redis.from_url(redis_url)
r.set("hello", "world")
print("Redis says:", r.get("hello").decode())
