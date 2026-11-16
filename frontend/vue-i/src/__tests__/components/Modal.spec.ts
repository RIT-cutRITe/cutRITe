import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Modal from '../../components/Modal.vue'
import CardModal from '../../components/CardModal.vue'
import GeneratorCard from '../../components/GeneratorCard.vue'
import router from '@/router'

const description = { name: 'ABox', description: 'A simple box', images: [] }

function stubFetch(ok = true) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => description } as Response)
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('Modal', () => {
  it('fetches the description when opened', async () => {
    const fetchMock = stubFetch()
    const wrapper = mount(Modal, { props: { name: 'ABox', modelValue: false }, attachTo: document.body })
    await wrapper.setProps({ modelValue: true })
    await flushPromises()

    expect(fetchMock.mock.calls[0]![0]).toMatch(/\/getDescription\?name=ABox$/)
    expect(document.body.textContent).toContain('A simple box')
    wrapper.unmount()
  })

  it('does not fetch while closed', async () => {
    const fetchMock = stubFetch()
    mount(Modal, { props: { name: 'ABox', modelValue: false } })
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('survives a failed request', async () => {
    stubFetch(false)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Modal, { props: { name: 'ABox', modelValue: false }, attachTo: document.body })
    await wrapper.setProps({ modelValue: true })
    await flushPromises()
    expect(document.body.textContent).not.toContain('A simple box')
    wrapper.unmount()
  })

  it('Exit closes the dialog', async () => {
    stubFetch()
    const wrapper = mount(Modal, { props: { name: 'ABox', modelValue: true }, attachTo: document.body })
    await flushPromises()
    const exit = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Exit'))!
    exit.click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('Edit navigates to the editing page with the generator name', async () => {
    stubFetch()
    const push = vi.spyOn(router, 'push').mockResolvedValue(undefined)
    const wrapper = mount(Modal, { props: { name: 'ABox', modelValue: true }, attachTo: document.body })
    await flushPromises()
    const edit = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Edit'))!
    edit.click()
    expect(push).toHaveBeenCalledWith({ name: 'editing', params: { name: 'ABox' } })
    wrapper.unmount()
  })
})

describe('CardModal', () => {
  it('opens the modal when the card emits open', async () => {
    stubFetch()
    const wrapper = mount(CardModal, {
      props: { name: 'ABox', title: 'Boxes', type: 'Boxes' },
      attachTo: document.body,
    })
    expect(wrapper.findComponent(Modal).props('modelValue')).toBe(false)
    wrapper.findComponent(GeneratorCard).vm.$emit('open', true)
    await flushPromises()
    expect(wrapper.findComponent(Modal).props('modelValue')).toBe(true)
    wrapper.unmount()
  })
})
