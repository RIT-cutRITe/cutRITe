import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Edge cases the real params.json never contains, so the JSON module is mocked.
async function mountWith(data: Record<string, unknown[]>) {
  vi.resetModules()
  vi.doMock('@/data/params.json', () => ({ default: { status: 'success', count: 0, data } }))
  const { default: Parameters } = await import('../../components/Parameters.vue')
  const wrapper = mount(Parameters)
  for (const header of wrapper.findAll('.v-expansion-panel-title')) await header.trigger('click')
  return wrapper
}

afterEach(() => vi.doUnmock('@/data/params.json'))

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
