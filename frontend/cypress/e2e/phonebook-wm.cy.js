describe('phonebook-CICD', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Phonebook')
    cy.contains('Add a new')
    cy.contains('Numbers')
  })
})