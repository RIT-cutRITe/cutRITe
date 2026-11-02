import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from '../App.vue'

const vuetify = createVuetify({ components, directives })

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, { global: { plugins: [vuetify] } })
    expect(wrapper.text()).toContain('')
  })
})
