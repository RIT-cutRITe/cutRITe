import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from '../App.vue'
import router from '../router'

const vuetify = createVuetify({ components, directives })

describe('App', () => {
  it('mounts and renders the navbar', async () => {
    router.push('/editing')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('cutRITe')
  it('mounts and renders the navbar', async () => {
    router.push('/editing')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('cutRITe')
  })
})
