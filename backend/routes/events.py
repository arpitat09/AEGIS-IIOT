import json
import queue
import time
from datetime import datetime
from flask import Blueprint, Response, request

events_bp = Blueprint("events", __name__)

# Active client subscriber queues
SUBSCRIBERS = set()


def broadcast_event(event_type, payload):
    """
    Broadcasts a real-time event to all active SSE subscribers.
    """
    data = json.dumps({
        "type": event_type,
        "payload": payload,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    })
    dead_subscribers = []
    for q in list(SUBSCRIBERS):
        try:
            q.put_nowait(data)
        except Exception:
            dead_subscribers.append(q)
    for q in dead_subscribers:
        SUBSCRIBERS.discard(q)


@events_bp.route("/stream/events", methods=["GET"])
def stream_events():
    """
    Server-Sent Events endpoint for zero-latency dashboard and alert updates.
    """
    def event_generator():
        client_queue = queue.Queue(maxsize=50)
        SUBSCRIBERS.add(client_queue)
        
        # Send initial connected handshake
        handshake = json.dumps({
            "type": "connection_established",
            "payload": {"message": "Connected to AEGIS-IIOT real-time event stream"},
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        })
        yield f"data: {handshake}\n\n"

        try:
            while True:
                try:
                    # Wait up to 15s for new events, else send keep-alive heartbeat
                    msg = client_queue.get(timeout=15.0)
                    yield f"data: {msg}\n\n"
                except queue.Empty:
                    heartbeat = json.dumps({
                        "type": "heartbeat",
                        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                    })
                    yield f"data: {heartbeat}\n\n"
        except GeneratorExit:
            pass
        finally:
            SUBSCRIBERS.discard(client_queue)

    return Response(
        event_generator(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )
