export function signIn() {
  cy.visit('/login');

  cy.get('input[name="email"]').eq(0).type('test@test.com');
  cy.get('input[name="password"]').eq(0).type('test123');
  cy.get('form button[type="submit"]').eq(0).click();
  cy.url().should('include', '/dashboard');
}

describe('Create a new account', () => {
  it('Creates a new account', () => {
    cy.visit('/');
    cy.contains('Get started').click();
    cy.url().should('include', '/login');

    cy.get('input[name="email"]').eq(1).type('test@test.com');
    cy.get('input[name="password"]').eq(1).type('test123');
    cy.get('form button[type="submit"]').eq(1).click();
  });

  it('Logs in with new account', () => {
    signIn();
  });
});

describe('Configure a new app and knowledge base and connect them', () => {
  before(() => {
    signIn();
  });

  it('Creates an app and a knowledge base', () => {
    cy.visit('/dashboard');
    cy.contains('Dashboard');
    cy.contains('Create new App').click();

    cy.get('input[name="name"]').type('Test App');
    cy.get('form button').eq(1).click();
    cy.contains('Test App');

    cy.contains('Create new Knowledge Base').click();

    cy.get('input[name="name"]').type('Test Knowledge Base');
    cy.get('form button').eq(1).click();
    cy.reload();
    cy.contains('Test Knowledge Base');

    cy.contains('Test App').click();
    cy.contains('Add knowledge base').click();
    cy.wait(1000);
    cy.get('button').eq(1).click();
  });
});
