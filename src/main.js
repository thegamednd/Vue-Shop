import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import amplifyConfig from './amplifyConfig'

// Configure Amplify for authentication
Amplify.configure({
  Auth: amplifyConfig
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')