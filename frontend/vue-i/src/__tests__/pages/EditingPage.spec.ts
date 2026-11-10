import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import EditingPage from '../../pages/EditingPage.vue'
import Parameters from '../../components/Parameters.vue'
import SvgEditor from '../../components/svgEditor.vue'

afterEach(() => vi.unstubAllGlobals())

describe('EditingPage', () => {
  it('composes the parameters panel and the SVG editor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }) }))
    const wrapper = mount(EditingPage, { props: { name: 'ABox' } })
    await flushPromises()
    expect(wrapper.findComponent(Parameters).exists()).toBe(true)
    expect(wrapper.findComponent(SvgEditor).exists()).toBe(true)
  })

  it('shows the generator name and passes it to Parameters', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }) }))
    const wrapper = mount(EditingPage, { props: { name: 'ABox' } })
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('ABox')
    expect(wrapper.findComponent(Parameters).props('name')).toBe('ABox')
  })
})
