// Headless UI flow: home page -> generator modal -> editing page.
// The backend is stubbed with cy.intercept so no server is needed.

const generators = { ABox: { link: 'ABox', name: 'ABox', type: 'Boxes' } }
const description = { name: 'ABox', description: 'A simple box', images: [] }
const params = {
  status: 'success',
  count: 1,
  data: {
    'Settings for the Lid': [
      { name: 'lid_height', type: 'text', default: '12', description: 'height', options: null },
    ],
  },
}

describe('Generator modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/getAll', generators).as('getAll')
    cy.intercept('GET', '**/getDescription*', description).as('getDescription')
    cy.intercept('GET', '**/getAllParams*', params).as('getAllParams')
    cy.intercept('POST', '**/generate*', { body: '<svg/>', headers: { 'content-type': 'image/svg+xml' } }).as('generate')
    cy.visit('/')
    cy.wait('@getAll')
  })

  it('opens the modal and loads the description', () => {
    cy.contains('button', 'Open').click()
    cy.wait('@getDescription').its('request.url').should('include', 'name=ABox')
    cy.contains('A simple box').should('be.visible')
  })

  it('closes the modal with Exit', () => {
    cy.contains('button', 'Open').click()
    cy.contains('A simple box').should('be.visible')
    cy.contains('button', 'Exit').click()
    cy.contains('A simple box').should('not.exist')
  })

  it('Edit navigates to the editing page and loads its parameters', () => {
    cy.contains('button', 'Open').click()
    cy.contains('button', 'Edit').click()
    cy.location('pathname').should('eq', '/editing/ABox')
    cy.wait('@getAllParams').its('request.url').should('include', 'name=ABox')
    cy.wait('@generate').its('request.url').should('include', 'name=ABox')
    cy.get('h1').should('contain', 'ABox')
    cy.contains('Settings for the Lid').should('be.visible')
  })

  it('does not 404 when the editing page is reloaded', () => {
    cy.visit('/editing/ABox')
    cy.wait('@getAllParams')
    cy.contains('Settings for the Lid').should('be.visible')
  })
})
