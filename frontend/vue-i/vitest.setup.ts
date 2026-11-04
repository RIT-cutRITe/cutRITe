import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import vuetify from './src/plugins/vuetify'

// Install the app's Vuetify (with the theme colors) for every mounted component.
config.global.plugins = [vuetify]

// jsdom has no ResizeObserver, which Vuetify layout components (e.g. v-app) require.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)
