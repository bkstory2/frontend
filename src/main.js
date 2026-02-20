import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import ko from 'element-plus/dist/locale/ko.mjs'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus, { locale: ko })
app.use(store).use(router).mount('#app')
