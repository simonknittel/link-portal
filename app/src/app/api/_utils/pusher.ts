import Pusher from "pusher";
import { env } from "~/env.mjs";

export function getPusherClient() {
  if (
    !env.PUSHER_APP_ID ||
    !env.NEXT_PUBLIC_PUSHER_APP_KEY ||
    !env.PUSHER_APP_SECRET ||
    !env.NEXT_PUBLIC_PUSHER_HOST ||
    !env.NEXT_PUBLIC_PUSHER_PORT
  )
    return;

  return new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: env.PUSHER_APP_SECRET,
    host: env.NEXT_PUBLIC_PUSHER_HOST,
    port: env.NEXT_PUBLIC_PUSHER_PORT,
  });
}
