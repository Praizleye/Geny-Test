#!/usr/bin/env python3
import os
import json
import sys

try:
    # Optional: load .env if python-dotenv is installed
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass

try:
    import redis  # type: ignore
except ImportError as e:
    print("Missing dependency 'redis'. Install with: pip install -r scripts/requirements.txt", file=sys.stderr)
    raise e

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CHANNEL = "booking.created"


def main():
    r = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    pubsub = r.pubsub()
    pubsub.subscribe(CHANNEL)
    print(f"[subscriber] Connected to {REDIS_URL}. Listening on '{CHANNEL}'... (Ctrl+C to exit)")
    try:
        for message in pubsub.listen():
            if message.get("type") != "message":
                continue
            raw = message.get("data")
            try:
                payload = json.loads(raw)
                print("[booking.created]", json.dumps(payload, indent=2, default=str))
            except Exception:
                print("[booking.created]", raw)
    except KeyboardInterrupt:
        print("\n[subscriber] Shutting down...")
    finally:
        try:
            pubsub.close()
        except Exception:
            pass


if __name__ == "__main__":
    main()
