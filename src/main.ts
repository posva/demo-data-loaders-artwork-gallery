import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'

const app = createApp(App)

app.use(createPinia())
app.use(DataLoaderPlugin, { router })
app.use(router)

app.mount('#app')
