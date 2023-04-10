// COMANDO CUSTOMIZADO

// Preenche os campos obrigatórios e submete
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Myrela Caroline')    
    cy.get('#lastName').type('de Barros Silva')    
    cy.get('#email').type('test@test.com') 
    cy.get('#phone').type('12991711380')    
    cy.get('#open-text-area').type('Teste')
    
    cy.contains('button', 'Enviar').click()
})
