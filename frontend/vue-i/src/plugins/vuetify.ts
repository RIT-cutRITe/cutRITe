import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Single place to define the app's colors. Each key becomes a color name usable in templates (color="primary") and a CSS variable (var(--v-theme-primary)).
const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#F76902',
    secondary: '#D0D3D4',
    accent: '#7D55C7',
    error: '#DA291C',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#FBC02D',
  },
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#FF8A3D',
    secondary: '#9C73BD',
    accent: '#4DD0E1',
    error: '#EF5350',
    info: '#64B5F6',
    success: '#66BB6A',
    warning: '#FFD54F',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: { light, dark },
  },
})
