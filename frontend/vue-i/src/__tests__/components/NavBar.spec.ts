import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { VLayout } from 'vuetify/components'
import NavBar from '../../components/NavBar.vue'

describe('NavBar', () => {
  it('renders the app title and links', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:p(.*)*', component: {} }] })
    const wrapper = mount({ components: { VLayout, NavBar }, template: '<v-layout><NavBar /></v-layout>' }, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('cutRITe')
    expect(wrapper.text()).toContain('Editing')
  })
})
