import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import { mount, shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import EntityInfo from '@/components/EntityInfo.vue'
import mockRouter from './mockRouter'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('EntityInfo', () => {
  it('displays Business entity info properly', async () => {
    // session storage must be set before mounting component
    sessionStorage.clear()
    sessionStorage.setItem('BUSINESS_ID', 'CP0001191')

    // set store properties
    store.state.entityName = 'My Business'
    store.state.entityStatus = 'GOODSTANDING'
    store.state.entityBusinessNo = '123456789'
    store.state.entityIncNo = 'CP0001191'
    store.state.businessEmail = 'business@mail.zzz'
    store.state.businessPhone = '(111)222-3333'
    store.state.businessPhoneExtension = '444'

    // mount the component and wait for everything to stabilize
    const wrapper = shallowMount(EntityInfo, { store, vuetify })
    await Vue.nextTick()

    // verify displayed text
    expect(wrapper.find('#entity-legal-name').text()).toBe('My Business')
    expect(wrapper.find('#entity-status').text()).toBe('In Good Standing')
    expect(wrapper.find('#entity-business-number').text()).toBe('123456789')
    expect(wrapper.find('#entity-incorporation-number').text()).toBe('CP0001191')
    expect(wrapper.find('#entity-business-email').text()).toBe('business@mail.zzz')
    expect(wrapper.find('#entity-business-phone').text()).toBe('(111)222-3333 x444')
    expect(wrapper.find('#nr-subtitle').exists()).toBeFalsy()
    expect(wrapper.find('#nr-number').exists()).toBeFalsy()
  })

  it('displays Draft Incorp App entity info properly - Named Company', async () => {
    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Named Company'
    store.state.entityStatus = 'DRAFT_INCORP_APP'
    store.state.entityType = 'BC'
    store.state.nameRequest = { nrNumber: 'NR 1234567' }

    const wrapper = shallowMount(EntityInfo, { store, vuetify })
    await Vue.nextTick()

    expect(wrapper.find('#incorp-app-title').text()).toBe('My Named Company')
    expect(wrapper.find('#entity-status').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-incorporation-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-email').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-phone').exists()).toBeFalsy()
    expect(wrapper.find('#nr-subtitle').text()).toBe('BC Benefit Company Incorporation Application')
    expect(wrapper.find('#nr-number').text()).toBe('NR 1234567')
  })

  it('displays Draft Incorp App entity info properly - Numbered Company', async () => {
    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = null
    store.state.entityStatus = 'DRAFT_INCORP_APP'
    store.state.entityType = 'BC'
    store.state.nameRequest = null

    const wrapper = shallowMount(EntityInfo, { store, vuetify })
    await Vue.nextTick()

    expect(wrapper.find('#incorp-app-title').text()).toBe('Numbered Benefit Company')
    expect(wrapper.find('#entity-status').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-incorporation-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-email').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-phone').exists()).toBeFalsy()
    expect(wrapper.find('#nr-subtitle').text()).toBe('BC Benefit Company Incorporation Application')
    expect(wrapper.find('#nr-number').exists()).toBeFalsy()
  })

  it('displays Paid (Named) Incorp App entity info properly', async () => {
    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Future Company'
    store.state.entityStatus = 'FILED_INCORP_APP'
    store.state.entityType = 'BC'
    store.state.nameRequest = { nrNumber: 'NR 1234567' }

    const wrapper = shallowMount(EntityInfo, { store, vuetify })
    await Vue.nextTick()

    expect(wrapper.find('#incorp-app-title').text()).toBe('My Future Company')
    expect(wrapper.find('#entity-status').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-incorporation-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-email').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-phone').exists()).toBeFalsy()
    expect(wrapper.find('#nr-subtitle').text()).toBe('BC Benefit Company Incorporation Application')
    expect(wrapper.find('#nr-number').text()).toBe('NR 1234567')
  })

  it('handles empty data', async () => {
    sessionStorage.clear()

    store.state.entityName = null
    store.state.entityType = null
    store.state.entityStatus = null
    store.state.entityBusinessNo = null
    store.state.entityIncNo = null
    store.state.businessEmail = null
    store.state.businessPhone = null
    store.state.businessPhoneExtension = null

    const wrapper = shallowMount(EntityInfo, { store, vuetify })
    await Vue.nextTick()

    expect(wrapper.find('#entity-legal-name').exists()).toBeFalsy()
    expect(wrapper.find('#entity-status').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-incorporation-number').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-email').exists()).toBeFalsy()
    expect(wrapper.find('#entity-business-phone').exists()).toBeFalsy()
    expect(wrapper.find('#nr-subtitle').exists()).toBeFalsy()
    expect(wrapper.find('#nr-number').exists()).toBeFalsy()
  })

  it('displays the breadcrumb correctly', async () => {
    const store = getVuexStore()
    const router = mockRouter.mock()

    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Named Company'
    const wrapper = mount(EntityInfo, { vuetify, store, router })

    await Vue.nextTick()

    const breadcrumbs = wrapper.vm.$el.querySelectorAll('.v-breadcrumbs li')
    const crumb1 = breadcrumbs[0]
    const divider = breadcrumbs[1] // Divider is present every odd index
    const crumb2 = breadcrumbs[2]
    const crumb3 = breadcrumbs[4]

    expect(crumb1.textContent).toContain('Manage Businesses')
    expect(divider.textContent).toContain('>')
    expect(crumb2.textContent).toContain('My Named Company')
    expect(crumb3).toBeUndefined()
  })

  it('displays the breadcrumb correctly when navigating to an annual report', async () => {
    const store = getVuexStore()
    const router = mockRouter.mock()
    router.push('annual-report')

    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Named Company'
    store.state.ARFilingYear = '2020'
    const wrapper = mount(EntityInfo, { vuetify, store, router })

    await Vue.nextTick()

    const breadcrumbs = wrapper.vm.$el.querySelectorAll('.v-breadcrumbs li')
    const crumb1 = breadcrumbs[0]
    const divider = breadcrumbs[1] // Divider is present every odd index
    const crumb2 = breadcrumbs[2]
    const crumb3 = breadcrumbs[4]

    expect(crumb1.textContent).toContain('Manage Businesses')
    expect(divider.textContent).toContain('>')
    expect(crumb2.textContent).toContain('My Named Company')
    expect(crumb3.textContent).toContain('File 2020 Annual Report')
  })

  it('displays the breadcrumb correctly when navigating to an address change', async () => {
    const store = getVuexStore()
    const router = mockRouter.mock()
    router.push('standalone-addresses')

    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Named Company'
    const wrapper = mount(EntityInfo, { vuetify, store, router })

    await Vue.nextTick()

    const breadcrumbs = wrapper.vm.$el.querySelectorAll('.v-breadcrumbs li')
    const crumb1 = breadcrumbs[0]
    const divider = breadcrumbs[1] // Divider is present every odd index
    const crumb2 = breadcrumbs[2]
    const crumb3 = breadcrumbs[4]

    expect(crumb1.textContent).toContain('Manage Businesses')
    expect(divider.textContent).toContain('>')
    expect(crumb2.textContent).toContain('My Named Company')
    expect(crumb3.textContent).toContain('Address Change')
  })

  it('displays the breadcrumb correctly when navigating to a Director Change', async () => {
    const store = getVuexStore()
    const router = mockRouter.mock()
    router.push('standalone-directors')

    sessionStorage.clear()
    sessionStorage.setItem('TEMP_REG_NUMBER', 'T123456789')

    store.state.entityName = 'My Named Company'
    const wrapper = mount(EntityInfo, { vuetify, store, router })

    await Vue.nextTick()

    const breadcrumbs = wrapper.vm.$el.querySelectorAll('.v-breadcrumbs li')
    const crumb1 = breadcrumbs[0]
    const divider = breadcrumbs[1] // Divider is present every odd index
    const crumb2 = breadcrumbs[2]
    const crumb3 = breadcrumbs[4]

    expect(crumb1.textContent).toContain('Manage Businesses')
    expect(divider.textContent).toContain('>')
    expect(crumb2.textContent).toContain('My Named Company')
    expect(crumb3.textContent).toContain('Director Change')
  })
})
