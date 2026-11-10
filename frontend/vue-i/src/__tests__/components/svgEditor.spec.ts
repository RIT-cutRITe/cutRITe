import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgEditor from '../../components/svgEditor.vue'

describe('svgEditor', () => {
  it('renders the title', () => {
    const wrapper = mount(SvgEditor)
    expect(wrapper.text()).toContain('Scrollable SVG Canvas')
  })

  it('renders the svg prop inline', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect id="box" width="10" height="10"/></svg>'
    const wrapper = mount(SvgEditor, { props: { svg } })
    expect(wrapper.find('.image-viewport svg rect#box').exists()).toBe(true)
  })

  it('renders no svg when prop is empty', () => {
    const wrapper = mount(SvgEditor, { props: { svg: '' } })
    expect(wrapper.find('.image-viewport svg').exists()).toBe(false)
  })
})
