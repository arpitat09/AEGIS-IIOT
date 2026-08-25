import { useState, useEffect, useRef } from "react";
import { API_URL } from "../services/api";

/**
 * useRealtimeStream Hook
 * Subscribes to Server-Sent Events (SSE) from /api/stream/events.
 * Provides live telemetry with connection state and automatic reconnection.
 */
export function useRealtimeStream(onNewAlert) {
  const [connectionState, setConnectionState] = useState("Connecting");
  const [lastEventTime, setLastEventTime] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const onNewAlertRef = useRef(onNewAlert);

  useEffect(() => {
    onNewAlertRef.current = onNewAlert;
  }, [onNewAlert]);

  useEffect(() => {
    let isSubscribed = true;

    const connectSSE = () => {
      if (!isSubscribed) return;

      const streamUrl = `${API_URL}/api/stream/events`;
      
      try {
        const es = new EventSource(streamUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          if (isSubscribed) {
            setConnectionState("Connected");
          }
        };

        es.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(event.data);
            setLastEventTime(new Date());

            if (data.type === "new_alert" && onNewAlertRef.current) {
              onNewAlertRef.current(data.payload);
            }
          } catch (err) {
            console.warn("SSE JSON parse error:", err);
          }
        };

        es.onerror = () => {
          if (isSubscribed) {
            setConnectionState("Reconnecting");
            es.close();
            // Schedule reconnect in 3s
            reconnectTimeoutRef.current = setTimeout(connectSSE, 3000);
          }
        };
      } catch (err) {
        if (isSubscribed) {
          setConnectionState("Disconnected");
          reconnectTimeoutRef.current = setTimeout(connectSSE, 5000);
        }
      }
    };

    connectSSE();

    return () => {
      isSubscribed = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionState,
    lastEventTime,
    isConnected: connectionState === "Connected",
  };
}
