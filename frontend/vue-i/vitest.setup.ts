import { afterAll, afterEach, vi } from 'vitest'
import { server } from './src/mocks/server'
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

// No backend in tests: MSW answers API calls; any unmocked request fails the test.
server.listen({ onUnhandledFrame: 'error' })
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
