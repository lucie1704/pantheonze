import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Aura from '@primevue/themes/aura'

// Import theme and styles
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './assets/main.css'

// Import common PrimeVue components
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import TabPanel from 'primevue/tabpanel'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Tooltip from 'primevue/tooltip'
import Select from 'primevue/select'
import Drawer from 'primevue/drawer'
import Dropdown from 'primevue/dropdown'
import Menu from 'primevue/menu'

import App from './App.vue'
import { router } from './router'
import { authService } from '@/services'
import { definePreset } from '@primevue/themes'

// Vérifier l'authentification au démarrage
authService.verifyToken().catch(() => {
  console.log('Token invalide détecté, déconnexion automatique')
})

const PastryTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf8f6',
      100: '#f4efe9',
      200: '#e8ddd2',
      300: '#d4c4b0',
      400: '#bda388',
      500: '#8B4513',
      600: '#7a3c11',
      700: '#6B3410',
      800: '#5a2d0e',
      900: '#4b250c',
      950: '#3d1e0a',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#8B4513',
          contrastColor: '#ffffff',
          hoverColor: '#A0522D',
          activeColor: '#6B3410',
        },
        surface: {
          0: '#ffffff',
          50: '#f9f7f5',
          100: '#f4efe9',
          200: '#e4e1de',
          300: '#d4c4b0',
          400: '#bda388',
          500: '#8B4513',
          600: '#7a3c11',
          700: '#6B3410',
          800: '#5a2d0e',
          900: '#4b3832',
          950: '#3d1e0a',
        },
                  gray: {
            0: '#ffffff',
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a',
          },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: PastryTheme,
    options: {
      darkModeSelector: false,
      cssLayer: false,
    },
  },
  inputStyle: 'outlined',
  autoZIndex: true,
  focusOnHover: false,
})
app.use(ToastService)

// Register common components globally
app.component('Button', Button)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('Dialog', Dialog)
app.component('TabPanel', TabPanel)
app.component('Password', Password)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('Select', Select)
app.component('Drawer', Drawer)
app.component('Dropdown', Dropdown)
app.component('Menu', Menu)

// Register directives
app.directive('tooltip', Tooltip)

app.mount('#app')