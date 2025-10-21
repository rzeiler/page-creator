import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {
    // Event, wenn ein Update verfügbar ist
    const event = new CustomEvent('pwa-update-available')
    window.dispatchEvent(event)
  },
  onOfflineReady() {
    console.log('App ist offline verfügbar')
  },
})