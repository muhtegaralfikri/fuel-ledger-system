// /frontend/src/main.ts

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// --- 1. Impor PrimeVUE & PrimeFlex ---
import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.css'                      // Layout & Responsif
import 'primevue/resources/themes/lara-light-blue/theme.css' // Tema (Skin)
import 'primevue/resources/primevue.min.css'         // Core CSS
import 'primeicons/primeicons.css'                   // Ikon

// --- 2. Hapus CSS Bawaan Vite (PENTING) ---
// import './assets/main.css' 
// (Kita komentari ini. CSS bawaan Vite akan 'berkelahi' dengan PrimeFlex)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// --- 3. Aktifkan PrimeVUE ---
app.use(PrimeVue, { 
  ripple: true // Efek klik 'ripple' yang bagus
});

app.mount('#app')