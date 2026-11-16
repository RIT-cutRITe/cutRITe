import { afterEach, vi } from 'vitest'
import { server } from './src/mocks/server'
import { config, enableAutoUnmount } from '@vue/test-utils'
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
// No server.close(): components fire fetches on mount that tests don't await. Closing in afterAll
// lets those still-pending requests fall through to the real network (ECONNREFUSED). Each test
// file runs in its own isolated module context, so the interceptor is discarded with it anyway.
// jsdom has no visualViewport, which Vuetify overlays (v-dialog) read when positioning.
vi.stubGlobal('visualViewport', {
  width: 1024,
  height: 768,
  addEventListener() {},
  removeEventListener() {},
})

// Unmount every wrapper after each test so Vuetify timers (e.g. VImg's poll) stop
// before jsdom is torn down, which otherwise throws "window is not defined".
enableAutoUnmount(afterEach)
