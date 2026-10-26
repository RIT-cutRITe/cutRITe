import { vi } from 'vitest'

// jsdom has no ResizeObserver, which Vuetify layout components (e.g. v-app) require.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)
