import TemplateCard from '@/components/TemplateCard.vue'
import HomeView from '@/pages/HomeView.vue'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VChip } from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({ components, directives })

test('Testing Box Filtering for Homepage',async ()=>{
    const screen = mount(HomeView, { global: { plugins: [vuetify] } })
    expect(screen.html()).toContain('Templates')
    const chips = screen.findAll('.v-chip')
    const miscChip = chips.find((chip) => chip.text() == 'misc')
    await miscChip?.trigger('click')
    const allCards = screen.findAllComponents(TemplateCard)
    for (const card of allCards){
        expect(card.props().type).toBe('misc')
    }
} )

test('Testing Box Type Filtering for Homepage',async ()=>{
    const screen = mount(HomeView, { global: { plugins: [vuetify] } })
    expect(screen.html()).toContain('Templates')
    const chips = screen.findAll('.v-chip')
    const miscChip = chips.find((chip) => chip.text() == 'Box')
    await miscChip?.trigger('click')
    const allCards = screen.findAllComponents(TemplateCard)
    for (const card of allCards){
        expect(card.props().type).toBe('Box')
    }

} )