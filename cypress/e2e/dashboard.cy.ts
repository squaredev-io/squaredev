export function signIn() {
  cy.visit('/login');

  cy.get('input[name="email"]').eq(1).type('test@test.com');
  cy.get('input[name="password"]').eq(1).type('test123');
  cy.get('form button[type="submit"]').eq(1).click();
  cy.url().should('include', '/dashboard');
}

describe('Create a new account', () => {
  it('Creates a new account', () => {
    cy.visit('/');
    cy.contains('Get Started').click();
    cy.url().should('include', '/login');

    cy.get('input[name="email"]').eq(0).type('test@test.com');
    cy.get('input[name="password"]').eq(0).type('test123');
    cy.get('form button[type="submit"]').eq(0).click();
  });

  it('Logs in with new account', () => {
    signIn();
  });
});

describe('Configure a new project and index', () => {
  before(() => {
    signIn();
  });

  it('Creates an project and a knowledge base', () => {
    cy.visit('/dashboard');
    cy.contains('Dashboard');
    cy.contains('Create new project').click();

    cy.get('input[name="name"]').type(`Test Project ${new Date().getTime()}`);
    cy.get('form button').eq(1).click();

    cy.contains('Test project').click();

    cy.contains('Add index').click();

    cy.get('input[name="name"]').type(`Test Index ${new Date().getTime()}`);

    cy.contains('add').click();
    cy.contains('Test Index');
  });
});
