describe('phonebook-CICD', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('filter')
    cy.contains('Phonebook')
    cy.contains('Numbers')
  })
})