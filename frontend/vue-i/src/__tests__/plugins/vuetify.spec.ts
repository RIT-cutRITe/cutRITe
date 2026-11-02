import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import vuetify from '../../plugins/vuetify'

describe('vuetify plugin', () => {
  it('registers light and dark themes with the RIT orange primary', () => {
    // The theme is only populated once the plugin is installed into an app.
    const wrapper = mount({ template: '<div />' }, { global: { plugins: [vuetify] } })
    const { name, themes } = wrapper.vm.$vuetify.theme
    expect(name).toBe('light')
    expect(themes.light!.colors.primary).toBe('#F76902')
    expect(themes.dark!.dark).toBe(true)
  })
})
