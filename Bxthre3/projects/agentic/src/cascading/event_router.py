"""Event Router — Redis pub/sub event routing — semantic version 2.0.0"""
import redis
import logging
from typing import Dict, Optional, Callable

__version__ = "1.0.0"
VERSION = "1.0.0"


class EventRouter:
    def __init__(self, redis_host: str = "localhost", redis_port: int = 6379):
        self.redis = redis.StrictRedis(
            host=redis_host, port=redis_port, db=0, decode_responses=True
        )
        self.logger = logging.getLogger("EventRouter")

    def publish_event(self, event_type: str, data: Dict) -> bool:
        try:
            self.redis.publish(event_type, str(data))
            self.logger.info(f"Published event: {event_type}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to publish event: {e}")
            return False

    def subscribe_to_event(self, event_type: str, callback: Callable) -> None:
        pubsub = self.redis.pubsub()
        pubsub.subscribe(event_type)
        self.logger.info(f"Subscribed to event: {event_type}")
        for message in pubsub.listen():
            if message["type"] == "message":
                callback(message["data"])