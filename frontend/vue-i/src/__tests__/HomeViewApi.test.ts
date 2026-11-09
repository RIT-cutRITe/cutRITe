import GeneratorCard from '@/components/GeneratorCard.vue'
import HomeView from '@/pages/HomeView.vue'
import mockGenerators from '@/data/generators'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => vi.unstubAllGlobals())

test('HomeView shows generators fetched from /getAll', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      ABox: { link: 'ABox', name: 'ABox', type: 'Boxes' },
    }),
  })
  vi.stubGlobal('fetch', fetchMock)

  const screen = mount(HomeView)
  await flushPromises()

  expect(fetchMock.mock.calls[0]![0]).toMatch(/\/getAll$/)
  const cards = screen.findAllComponents(GeneratorCard)
  expect(cards).toHaveLength(1)
  expect(cards[0]!.props('name')).toBe('ABox')
})

test('HomeView falls back to mock data when the API fails', async () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))

  const screen = mount(HomeView)
  await flushPromises()

  expect(screen.findAllComponents(GeneratorCard).length).toBeGreaterThan(0)
  expect(mockGenerators.length).toBeGreaterThan(0)
})
