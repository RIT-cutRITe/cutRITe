import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { VLayout, VSelect } from 'vuetify/components'
import Parameters from '../../components/Parameters.vue'
import paramsJson from '../../data/params.json'

type Param = { name: string; type: string; default: string | boolean; options: string[] | null }
const sections = paramsJson.data as Record<string, Param[]>
const allParams = Object.values(sections).flat()

// Parameters now loads its sections from the API; serve params.json instead.
beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => paramsJson,
    text: async () => '<svg/>', // Parameters calls /generate after loading
  } as Response)
})

//Panel contents are lazy-rendered by Vuetify, so open every panel before querying inputs.
async function mountOpen() {
  const wrapper = mount(
    { components: { VLayout, Parameters }, template: '<v-layout><Parameters name="ABox" /></v-layout>' },
    { attachTo: document.body },
  )
  await flushPromises()
  for (const header of wrapper.findAll('.v-expansion-panel-title')) {
    await header.trigger('click')
  }
  return wrapper
}

// Vuetify wires <label for=id> to the real <input>, so look inputs up by the parameter name.
function inputFor(wrapper: ReturnType<typeof mount>, name: string) {
  const label = wrapper.findAll('label').find((l) => l.text() === name)!
  return wrapper.find<HTMLInputElement>(`#${label.attributes('for')}`)
}

describe('Parameters', () => {
  it('renders the heading and one panel per JSON section', async () => {
    const wrapper = mount(Parameters, { props: { name: 'ABox' } })
    await flushPromises()
    expect(wrapper.text()).toContain('Parameters:')
    const titles = wrapper.findAll('.v-expansion-panel-title').map((t) => t.text())
    expect(titles).toEqual(Object.keys(sections))
  })

  it('creates the right kind of input for every parameter type', async () => {
    const wrapper = await mountOpen()
    const count = (type: string) => allParams.filter((p) => p.type === type).length
    expect(wrapper.findAll('.v-select')).toHaveLength(count('select'))
    expect(wrapper.findAll('.v-checkbox')).toHaveLength(count('checkbox'))
    expect(wrapper.findAll('.v-text-field:not(.v-select)')).toHaveLength(count('text'))
    wrapper.unmount()
  })

  it('seeds text fields with the default from the JSON', async () => {
    const wrapper = await mountOpen()
    for (const p of allParams.filter((p) => p.type === 'text')) {
      expect(inputFor(wrapper, p.name).element.value).toBe(p.default)
    }
    wrapper.unmount()
  })

  it('reflects checkbox defaults', async () => {
    const wrapper = await mountOpen()
    const boxes = wrapper.findAll<HTMLInputElement>('input[type=checkbox]')
    const expected = allParams.filter((p) => p.type === 'checkbox').map((p) => p.default)
    expect(boxes.map((b) => b.element.checked)).toEqual(expected)
    wrapper.unmount()
  })

  it('updates the value when the user edits a text field', async () => {
    const wrapper = await mountOpen()
    const input = inputFor(wrapper, 'FingerJoint_surroundingspaces')
    await input.setValue('7.5')
    expect(input.element.value).toBe('7.5')
    wrapper.unmount()
  })

  it('shows the select default and its description hint', async () => {
    const wrapper = await mountOpen()
    expect(inputFor(wrapper, 'FingerJoint_style').element.value).toBe('rectangular')
    expect(wrapper.text()).toContain('style of the fingers')
    wrapper.unmount()
  })

  it('updates the value when the user picks a select option', async () => {
    const wrapper = await mountOpen()
    const select = wrapper.findAllComponents(VSelect)[0]!
    select.vm.$emit('update:modelValue', 'springs')
    await wrapper.vm.$nextTick()
    expect(inputFor(wrapper, 'FingerJoint_style').element.value).toBe('springs')
    wrapper.unmount()
  })

  it('toggles a checkbox', async () => {
    const wrapper = await mountOpen()
    const box = wrapper.find<HTMLInputElement>('input[type=checkbox]')
    const before = box.element.checked
    await box.setValue(!before)
    expect(box.element.checked).toBe(!before)
    wrapper.unmount()
  })
})
