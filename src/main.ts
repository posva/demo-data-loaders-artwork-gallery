import './assets/main.css'
import './assets/masonry.css'

import { createApp } from 'vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { PiniaColada } from '@pinia/colada'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})
app.use(DataLoaderPlugin, { router })
app.use(router)

app.mount('#app')
