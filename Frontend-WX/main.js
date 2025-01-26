import App from './App'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import {useTowxml} from '@/wxcomponents/towxml/index.js'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$towxml = useTowxml
  app.use(createPinia())
  return {
    app
  }
}