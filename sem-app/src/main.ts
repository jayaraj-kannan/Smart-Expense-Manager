/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import "@/firebase";
import { toast, type ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
app.config.globalProperties.$showSuccessToast = (msg: string) => {
    toast(msg, {
      autoClose: 2500,
      position: toast.POSITION.TOP_RIGHT,
    } as ToastOptions);
  };
registerPlugins(app)

app.mount('#app')
