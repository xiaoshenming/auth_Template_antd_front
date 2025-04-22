import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import { setupInterceptors } from './utils/auth'

// 初始化API拦截器
setupInterceptors();

const app = createApp(App)

app.use(router)
app.use(Antd)

app.mount('#app')
