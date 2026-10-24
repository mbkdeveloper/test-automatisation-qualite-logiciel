describe("Module Login", () => {
  beforeEach(() => {
    cy.visit("/WebTours/index.htm");
  });

  it("RSVA_FT-1100 : jojo/bean permet de se connecter, message Welcome s'affiche", () => {
    cy.getFrame("body", "navbar").find("input[name='username']").type("jojo");
    cy.getFrame("body", "navbar").find("input[name='password']").type("bean");
    cy.getFrame("body", "navbar").find("input[name='login']").click();
    cy.getFrame("body", "info").should("contain.text", "Welcome");
  });

  it("RSVA_ET-1101 : connexion avec champs vides", () => {
    cy.getFrame("body", "navbar").find("input[name='login']").click();
    cy.getFrame("body").should("not.contain.text", "Welcome, jojo");
  });
});