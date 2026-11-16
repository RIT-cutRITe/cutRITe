import { describe, it, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

// Edge cases the real params.json never contains, so the API response is mocked.
async function mountWith(data: Record<string, unknown[]>) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'success', count: 0, data }),
    text: async () => '<svg/>',
  } as Response)
  const { default: Parameters } = await import('../../components/Parameters.vue')
  const wrapper = mount(Parameters, { props: { name: 'ABox' } })
  await flushPromises()
  for (const header of wrapper.findAll('.v-expansion-panel-title')) await header.trigger('click')
  return wrapper
}

afterEach(() => vi.restoreAllMocks())

describe('Parameters edge cases', () => {
  it('renders a select whose options are null as an empty select', async () => {
    const wrapper = await mountWith({
      Misc: [{ name: 'broken', type: 'select', default: '', description: 'd', options: null }],
    })
    expect(wrapper.find('.v-select').exists()).toBe(true)
  })

  it('falls back to a text field for an unknown type', async () => {
    const wrapper = await mountWith({
      Misc: [{ name: 'weird', type: 'slider', default: '5', description: 'd', options: null }],
    })
    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('5')
  })

  it('renders no panels when the JSON has no sections', async () => {
    const wrapper = await mountWith({})
    expect(wrapper.findAll('.v-expansion-panel')).toHaveLength(0)
  })
})
