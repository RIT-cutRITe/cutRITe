import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import EditingPage from '../../pages/EditingPage.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Parameters from '../../components/Parameters.vue'
import SvgEditor from '../../components/svgEditor.vue'

afterEach(() => vi.unstubAllGlobals())

/**
 * Helper to create a router with history - history is so that router.replace() (as in the advanced parameters button) can work - otherwise the test will throw an error.
 */
const makeRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/editing/:name', name: 'editing', component: EditingPage }],
  })
/**
 * Helper to mount a page. Every test in the file was repeating this code before.
 * @param props any props (query or route parameters) you want to pass in
 * @param path defaults to '/editing/ABox'
 */
const mountPage = async (props: { name: string; advanced?: boolean }, path = '/editing/ABox') => {
  const router = makeRouter()
  router.push(path)
  await router.isReady()
  return { router, wrapper: mount(EditingPage, { props, global: { plugins: [router] } }) }
}

describe('EditingPage', () => {
  it('composes the parameters panel and the SVG editor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const { wrapper } = await mountPage({ name: 'ABox' })
    await flushPromises()
    expect(wrapper.findComponent(Parameters).exists()).toBe(true)
    expect(wrapper.findComponent(SvgEditor).exists()).toBe(true)
  })

  it('shows the generator name and passes it to Parameters', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const { wrapper } = await mountPage({ name: 'ABox' })
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('ABox')
    expect(wrapper.findComponent(Parameters).props('name')).toBe('ABox')
  })

  it('passes advanced to Parameters, defaulting to false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const { wrapper } = await mountPage({ name: 'ABox' })
    await flushPromises()
    expect(wrapper.findComponent(Parameters).props('advanced')).toBe(false)

    await wrapper.setProps({ advanced: true })
    expect(wrapper.findComponent(Parameters).props('advanced')).toBe(true)
  })

  it('writes advanced to the URL query when the toggle is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: {} }), text: async () => '<svg/>' }))
    const { wrapper, router } = await mountPage({ name: 'ABox', advanced: false })
    await flushPromises()
    await wrapper.get('[data-testid="advanced-toggle"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.query.advanced).toBe('true')
  })
})
