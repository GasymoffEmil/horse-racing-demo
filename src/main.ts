import { createApp } from 'vue'
import { store } from '@/app/store'
import '@/app/styles/global.scss'
import App from './App.vue'

createApp(App).use(store).mount('#app')
