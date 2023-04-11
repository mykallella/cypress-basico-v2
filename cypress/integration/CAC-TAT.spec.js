/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  beforeEach(function() {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function() {
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function() {
    const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'

    cy.get('#firstName')
      .should('be.visible')
      .type('Myrela Caroline')
      .should('have.value', 'Myrela Caroline')
    cy.get('#lastName')
      .should('be.visible')
      .type('de Barros Silva')
      .should('have.value', 'de Barros Silva')
    cy.get('#email')
      .should('be.visible')
      .type('test@test.com')
      .should('have.value', 'test@test.com')
    cy.get('#phone')
      .should('be.visible')
      .type('12991711380')
      .should('have.value', '12991711380')
    cy.get('#open-text-area')
      .should('be.visible')
      .type(longText, { delay: 0 })
      .should('have.value', longText)

    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
  })
  
  it.only('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.get('#firstName').type('Myrela Caroline')    
    cy.get('#lastName').type('de Barros Silva')    
    cy.get('#email').type('test@test,com') // email inválido    
    cy.get('#phone').type('12991711380')    
    cy.get('#open-text-area').type('Teste')
    
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible') 
  })

  it('campo telefone continua vazio quando preenchido com valor não numérico', function() {
    cy.get('#phone')
      .type('abcdefghij') // valor não numérico
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.get('#firstName').type('Myrela Caroline')    
    cy.get('#lastName').type('de Barros Silva')    
    cy.get('#email').type('test@test.com')
    cy.get('#phone-checkbox').check() // tico o ckeckbox telefone, mas esqueci de preencher o telefone antes
    cy.get('#open-text-area').type('Teste')
    
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
    cy.get('#firstName')
      .type('Myrela Caroline') 
      .should('have.value', 'Myrela Caroline')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('de Barros Silva') 
      .should('have.value', 'de Barros Silva')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('test@test.com') 
      .should('have.value', 'test@test.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('12991711380') 
      .should('have.value', '12991711380')
      .clear()
      .should('have.value', '')      
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
    cy.contains('button', 'Enviar').click() // botão que contém o texto 'Enviar'

    cy.get('.error').should('be.visible') 
  })

  it('envia o formuário com sucesso usando um comando customizado', function() {
    cy.fillMandatoryFieldsAndSubmit() // COMANDO CUSTOMIZADO

    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', function() {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', function() {
    cy.get('#product')
    .select('mentoria')
    .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', function() {
    cy.get('#product')
    .select(1)
    .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', function() {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', function() {
    cy.get('input[type="radio"]') // pega todos os radios
      .should('have.length', 3) // verifica se há 3 radios
      .each(function($radio) { // para cada 'radio'...
        cy.wrap($radio).check() // empacota e tica
        cy.wrap($radio).should('be.checked') // empacota e verifica se foi ticado
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', function() {
    cy.get('input[type="checkbox"')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input) { // verifica o elemento 'input' pego
        // console.log($input)
        expect($input[0].files[0].name).to.equal('example.json') // verifica nome do arquivo
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', function() {
    cy.get('input[type="file"]#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) // simula o arrastar arquivo para o campo
    .should(function($input) { // verifica o elemento 'input' pego
      // console.log($input)
      expect($input[0].files[0].name).to.equal('example.json') // verifica nome do arquivo
    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]#file-upload')
      .selectFile('@sampleFile')
      .should(function($input) { // verifica o elemento 'input' pego
        // console.log($input)
        expect($input[0].files[0].name).to.equal('example.json') // verifica nome do arquivo
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
    cy.get('#privacy a') // seleciona elemento
      .should('have.attr', 'target', '_blank') // verifica que tem atributo target="_blank"
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
    cy.get('#privacy a') // seleciona elemento
      .invoke('removeAttr', 'target') // remove atributo target="_blank"
      .click()

    cy.contains('Talking About Testing').should('be.visible') // verifica se a página tem o texto 'Talking About Testing'
  })


  
})

