import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)  // TODO: Language selector and i18n.
app.mount('#app')
