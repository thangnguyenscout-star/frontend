import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { router } from './router';
import { i18n } from './locales';
import App from './App.vue';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/styles/main.css';
const theme = definePreset(Aura, {
  primitive: {
    borderRadius: { xs: '3px', sm: '4px', md: '6px', lg: '8px', xl: '12px' },
  },
  semantic: {
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.100}',
          focusBackground: '{primary.200}',
          color: '{primary.800}',
          focusColor: '{primary.900}',
        },
      },
    },
    primary: {
      50: '#eff7ff',
      100: '#dceeff',
      200: '#bddfff',
      300: '#90caff',
      400: '#53a9f5',
      500: '#1683df',
      600: '#0067c0',
      700: '#005aab',
      800: '#084b89',
      900: '#103f70',
      950: '#102943',
    },
  },
});
createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: theme, options: { darkModeSelector: false } } })
  .use(ToastService)
  .use(ConfirmationService)
  .mount('#app');
