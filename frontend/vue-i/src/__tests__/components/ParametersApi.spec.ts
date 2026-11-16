import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { VLayout } from 'vuetify/components'
import Parameters from '../../components/Parameters.vue'

afterEach(() => vi.unstubAllGlobals())

const mountParams = () =>
  mount({ components: { VLayout, Parameters }, template: '<v-layout><Parameters name="ABox" /></v-layout>' })

describe('Parameters API', () => {
  it('requests /getAllParams for the given name and renders its sections', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { 'Settings for the Lid': [{ name: 'lid', type: 'text', default: 'x', options: null }] },
      }),
      text: async () => '<svg/>',
    })
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mountParams()
    await flushPromises()

    expect(fetchMock.mock.calls[0]![0]).toMatch(/\/getAllParams\?name=ABox&advanced=false$/)
    expect(wrapper.findAll('.v-expansion-panel-title').map((t) => t.text())).toEqual([
      'Settings for the Lid',
    ])
  })

  it('sends advanced=false on /getAllParams by default and advanced=true when set', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
      text: async () => '<svg/>',
    })
    vi.stubGlobal('fetch', fetchMock)
    mount({ components: { VLayout, Parameters }, template: '<v-layout><Parameters name="ABox" /></v-layout>' })
    await flushPromises()
    const paramsUrl = () => fetchMock.mock.calls.map((c) => c[0] as string).find((u) => u.includes('/getAllParams'))
    expect(paramsUrl()).toMatch(/\/getAllParams\?name=ABox&advanced=false$/)

    fetchMock.mockClear()
    mount({ components: { VLayout, Parameters }, template: '<v-layout><Parameters name="ABox" :advanced="true" /></v-layout>' })
    await flushPromises()
    expect(paramsUrl()).toMatch(/\/getAllParams\?name=ABox&advanced=true$/)
  })

  it('renders no panels when the request fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => '' }))
    const wrapper = mountParams()
    await flushPromises()
    expect(wrapper.findAll('.v-expansion-panel')).toHaveLength(0)
  })

  it('emits update:advanced with the flipped value when the button is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const wrapper = mount(Parameters, { props: { name: 'ABox' }, global: { stubs: {} } })
    await flushPromises()
    await wrapper.get('[data-testid="advanced-toggle"]').trigger('click')
    expect(wrapper.emitted('update:advanced')).toEqual([[true]])

    await wrapper.setProps({ advanced: true })
    await wrapper.get('[data-testid="advanced-toggle"]').trigger('click')
    expect(wrapper.emitted('update:advanced')![1]).toEqual([false])
  })

  it('refetches /getAllParams when the advanced prop changes', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' })
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mount(Parameters, { props: { name: 'ABox' } })
    await flushPromises()
    await wrapper.setProps({ advanced: true })
    await flushPromises()
    const urls = fetchMock.mock.calls.map((c) => c[0] as string).filter((u) => u.includes('/getAllParams'))
    expect(urls.at(-1)).toMatch(/advanced=true$/)
  })

  it('starts pressed when advanced is true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const wrapper = mount({ components: { VLayout, Parameters }, template: '<v-layout><Parameters name="ABox" :advanced="true" /></v-layout>' })
    await flushPromises()
    expect(wrapper.get('[data-testid="advanced-toggle"]').attributes('aria-pressed')).toBe('true')
  })
})
