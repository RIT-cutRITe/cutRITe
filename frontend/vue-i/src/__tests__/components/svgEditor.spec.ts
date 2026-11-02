import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgEditor from '../../components/svgEditor.vue'

describe('svgEditor', () => {
  it('renders the title and the scrollable image', () => {
    const wrapper = mount(SvgEditor)
    expect(wrapper.text()).toContain('Scrollable SVG Canvas')
    expect(wrapper.find('img[alt="scrollable-img"]').exists()).toBe(true)
  })
})
