import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditingPage from '../../pages/EditingPage.vue'

describe('EditingPage', () => {
  it('renders', () => {
    const wrapper = mount(EditingPage)
    expect(wrapper.text()).toContain('Editing')
  })
})
