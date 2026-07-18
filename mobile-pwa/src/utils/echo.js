import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws://${window.location.hostname}:6001`,
  wssPort: 6001,
  disableStats: true,
  // For local development without TLS
  encrypted: false,
})