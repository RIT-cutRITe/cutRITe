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

    expect(fetchMock.mock.calls[0]![0]).toMatch(/\/getAllParams\?name=ABox$/)
    expect(wrapper.findAll('.v-expansion-panel-title').map((t) => t.text())).toEqual([
      'Settings for the Lid',
    ])
  })

  it('renders no panels when the request fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => '' }))
    const wrapper = mountParams()
    await flushPromises()
    expect(wrapper.findAll('.v-expansion-panel')).toHaveLength(0)
  })
})
