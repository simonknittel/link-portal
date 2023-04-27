"use client";

import PusherJS from "pusher-js";
import { useEffect, useRef } from "react";
import { env } from "~/env.mjs";

// TODO: Extract this into a context
export function useRealtime() {
  const client = useRef<PusherJS>();

  useEffect(() => {
    if (
      !env.NEXT_PUBLIC_PUSHER_HOST ||
      !env.NEXT_PUBLIC_PUSHER_PORT ||
      !env.NEXT_PUBLIC_PUSHER_APP_KEY
    )
      return;

    client.current = new PusherJS(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      wsHost: env.NEXT_PUBLIC_PUSHER_HOST,
      wsPort: parseInt(env.NEXT_PUBLIC_PUSHER_PORT),
      disableStats: true,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });

    return () => {
      if (!client.current) return;
      client.current.disconnect();
      client.current = undefined;
    };
  }, []);

  return client;
}
