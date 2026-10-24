const buy = () => cy.info().find("input[name='buyFlights']").click();
const card = (v) => cy.info().find("input[name='creditCard']").clear().type(v);
const exp = (v) => cy.info().find("input[name='expDate']").clear().type(v);
const succes = () => cy.info().invoke("text").should("match", /Thank you/i);
const pasSucces = () => {
  cy.wait(1000);
  cy.info().invoke("text").should("not.match", /Thank you/i);
};

describe("Payment", () => {
  beforeEach(() => {
    cy.login();
    cy.goToPayment();
  });

  // ================= FT =================
  describe("FT - Functional testing", () => {
    it("FT-PY-01 : la page de paiement affiche les champs", () => {
      cy.info().find("input[name='firstName']").should("exist");
      cy.info().find("input[name='lastName']").should("exist");
      cy.info().find("input[name='creditCard']").should("exist");
      cy.info().find("input[name='expDate']").should("exist");
      cy.info().find("input[name='buyFlights']").should("exist");
    });

    it("FT-PY-02 : paiement valide", () => {
      card("123456789012");
      exp("12/30");
      buy();
      succes();
    });

    it("FT-PY-03 : le nom et prénom sont préremplis", () => {
      cy.info().find("input[name='firstName']").invoke("val").should("not.be.empty");
      cy.info().find("input[name='lastName']").invoke("val").should("not.be.empty");
    });
  });

  // ================= ET =================
  describe("ET - Error testing", () => {
    it("ET-PY-01 : numéro de carte vide", () => {
      cy.info().find("input[name='creditCard']").clear();
      exp("12/30");
      buy();
      pasSucces();
    });

    it("ET-PY-02 : numéro de carte avec des lettres", () => {
      card("abcdefgh");
      exp("12/30");
      buy();
      pasSucces();
    });

    it("ET-PY-03 : date d'expiration vide", () => {
      card("123456789012");
      cy.info().find("input[name='expDate']").clear();
      buy();
      pasSucces();
    });

    it("ET-PY-04 : date d'expiration au mauvais format", () => {
      card("123456789012");
      exp("abcd");
      buy();
      pasSucces();
    });

    it("ET-PY-05 : carte expirée", () => {
      card("123456789012");
      exp("01/20");
      buy();
      pasSucces();
    });
  });

  // ================= BT =================
  describe("BT - Boundary testing", () => {
    it("BT-PY-01 : numéro de carte très court (1 chiffre)", () => {
      card("1");
      exp("12/30");
      buy();
      pasSucces();
    });

    it("BT-PY-02 : numéro de carte très long (40 chiffres)", () => {
      card("1".repeat(40));
      exp("12/30");
      buy();
      pasSucces();
    });

    it("BT-PY-03 : date d'expiration le mois courant", () => {
      const d = new Date();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      card("123456789012");
      exp(`${mm}/${yy}`);
      buy();
      succes();
    });

    it("BT-PY-04 : mois invalide (13/30)", () => {
      card("123456789012");
      exp("13/30");
      buy();
      pasSucces();
    });
  });
});

// ================= PT =================
describe("PT - Permission testing", () => {
  it("PT-PY-01 : pas de paiement possible sans connexion", () => {
    cy.visit("/WebTours/index.htm");
    cy.getFrame("body", "navbar").find("input[name='username']").should("exist");
    cy.getFrame("body", "info").find("input[name='creditCard']").should("not.exist");
  });
});