import GeneratorCard from '@/components/GeneratorCard.vue'
import HomeView from '@/pages/HomeView.vue'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import generators from '@/data/generators'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({ components, directives })

test('Testing Box Filtering for Homepage', async () => {
  const screen = mount(HomeView, { global: { plugins: [vuetify] } })
  expect(screen.html()).toContain('Generators')

  //Click on the misc filter
  const chips = screen.findAll('.v-chip')
  const miscChip = chips.find((chip) => chip.text() == 'misc')
  await miscChip?.trigger('click')

  const allCards = screen.findAllComponents(GeneratorCard)

  //Check new cards types are 'misc';
  for (const card of allCards) {
    expect(card.props().type).toBe('misc')
  }
})

test('Testing Box Type Filtering for Homepage', async () => {
  const screen = mount(HomeView, { global: { plugins: [vuetify] } })
  expect(screen.html()).toContain('Generators')

  //Click on the Box filter
  const chips = screen.findAll('.v-chip')
  const miscChip = chips.find((chip) => chip.text() == 'Box')
  await miscChip?.trigger('click')

  const allCards = screen.findAllComponents(GeneratorCard)

  //Check new cards types are 'Box;
  for (const card of allCards) {
    expect(card.props().type).toBe('Box')
  }
})

test('Test Pagination (clicking on one page changes generators)', async () => {
  const screen = mount(HomeView, { global: { plugins: [vuetify] } })

  //Get generators from 1st page
  const allCards = screen.findAllComponents(GeneratorCard)
  const fistPagegeneratorsNames = allCards.map((card) => card.props('name'))

  //Click on next button
  const nextButton = screen.find('.v-pagination__next button')
  await nextButton.trigger('click')

  expect(screen.find('.v-pagination__item--is-active').text()).toBe('2')

  //Get Generators from 2nd page
  const secondPageCards = screen.findAllComponents(GeneratorCard)
  const secondPageGeneratoreNames = secondPageCards.map((card) => card.props('name'))

  //Compare that cards are different
  expect(fistPagegeneratorsNames).not.toEqual(secondPageGeneratoreNames)
})

test('Homepage renders Generators heading', () => {
  const screen = mount(HomeView, { global: { plugins: [vuetify] } })

  expect(screen.text()).toContain('Generators')
})

test('Changing filter resets pagination to page 1', async () => {
  const screen = mount(HomeView, { global: { plugins: [vuetify] } })

  // Check that there are enough Generators for multiple pages
  if (generators.length <= 8) return

  // Navigate to page 2
  const nextButton = screen.find('.v-pagination__next button')
  await nextButton.trigger('click')

  // Verify that page 2 is selected
  expect(screen.find('.v-pagination__item--is-active').text()).toBe('2')

  // Select misc filter
  const chips = screen.findAll('.v-chip')
  const miscChip = chips.find((chip) => chip.text() === 'misc')
  await miscChip?.trigger('click')

  // Verify pagination resets to page 1
  expect(screen.find('.v-pagination__item--is-active').text()).toBe('1')
})
