import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditingPage from '../../pages/EditingPage.vue'
import Parameters from '../../components/Parameters.vue'
import SvgEditor from '../../components/svgEditor.vue'

describe('EditingPage', () => {
  it('composes the parameters panel and the SVG editor', () => {
    const wrapper = mount(EditingPage)
    expect(wrapper.findComponent(Parameters).exists()).toBe(true)
    expect(wrapper.findComponent(SvgEditor).exists()).toBe(true)
  })
})
