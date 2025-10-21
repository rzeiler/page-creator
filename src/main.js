import { createApp } from 'vue'
import App from './components/ColoringCanvas.vue'

// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

const app = createApp(App)
app.mount('#app')