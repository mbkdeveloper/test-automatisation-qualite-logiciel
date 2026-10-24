// Date au format MM/DD/YYYY, décalée de n jours
const fmt = (n) => {
  const t = new Date();
  t.setDate(t.getDate() + n);
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${t.getFullYear()}`;
};

describe("Flights", () => {
  beforeEach(() => {
    cy.login();
    cy.openFlights();
  });

  // ================= FT =================
  describe("FT - Functional testing", () => {
    it("FT-FL-01 : le formulaire de recherche s'affiche", () => {
      cy.info().find("select[name='depart']").should("exist");
      cy.info().find("select[name='arrive']").should("exist");
      cy.info().find("input[name='numPassengers']").should("exist");
    });

    it("FT-FL-02 : recherche d'un vol valide affiche des vols", () => {
      cy.searchFlight({ depart: "Denver", arrive: "London",
        departDate: fmt(7), returnDate: fmt(14) });
      cy.info().find("input[name='outboundFlight']").should("exist");
    });

    it("FT-FL-03 : choix d'un vol mène à la page de paiement", () => {
      cy.searchFlight({ departDate: fmt(7), returnDate: fmt(14) });
      cy.info().find("input[name='reserveFlights']").click();
      cy.info().find("input[name='creditCard']").should("exist");
    });

    it("FT-FL-04 : réservation complète", () => {
      cy.searchFlight({ departDate: fmt(7), returnDate: fmt(14) });
      cy.info().find("input[name='reserveFlights']").click();
      cy.info().find("input[name='creditCard']").type("123456789");
      cy.info().find("input[name='expDate']").clear().type("12/30");
      cy.info().find("input[name='buyFlights']").click();
      cy.info().invoke("text").should("match", /Thank you|Invoice/i);
    });
  });

  // ================= ET =================
  describe("ET - Error testing", () => {
    it("ET-FL-01 : départ et arrivée identiques", () => {
      cy.searchFlight({ depart: "Paris", arrive: "Paris",
        departDate: fmt(7), returnDate: fmt(14) });
      cy.wait(1000);
      cy.info().find("input[name='outboundFlight']").should("not.exist");
    });

    it("ET-FL-02 : date de retour avant la date de départ", () => {
      cy.searchFlight({ departDate: fmt(14), returnDate: fmt(7) });
      cy.wait(1000);
      cy.info().find("input[name='outboundFlight']").should("not.exist");
    });

    it("ET-FL-03 : date de départ vide", () => {
      cy.info().find("input[name='departDate']").clear();
      cy.info().find("input[name='findFlights']").click();
      cy.wait(1000);
      cy.info().find("input[name='outboundFlight']").should("not.exist");
    });

    it("ET-FL-04 : paiement sans numéro de carte", () => {
      cy.searchFlight({ departDate: fmt(7), returnDate: fmt(14) });
      cy.info().find("input[name='reserveFlights']").click();
      cy.info().find("input[name='creditCard']").clear();
      cy.info().find("input[name='buyFlights']").click();
      cy.wait(1000);
      cy.info().invoke("text").should("not.match", /Thank you/i);
    });
  });

  // ================= BT =================
  describe("BT - Boundary testing (passagers)", () => {
    it("BT-FL-01 : 1 passager (valeur minimale valide)", () => {
      cy.searchFlight({ passengers: "1", departDate: fmt(7), returnDate: fmt(14) });
      cy.info().find("input[name='outboundFlight']").should("exist");
    });

    ["0", "-1", "abc"].forEach((val, i) => {
      it(`BT-FL-0${i + 2} : nombre de passagers invalide "${val}"`, () => {
        cy.searchFlight({ passengers: val, departDate: fmt(7), returnDate: fmt(14) });
        cy.wait(1000);
        cy.info().find("input[name='outboundFlight']").should("not.exist");
      });
    });

    it("BT-FL-05 : nombre de passagers très élevé (100)", () => {
      cy.searchFlight({ passengers: "100", departDate: fmt(7), returnDate: fmt(14) });
      cy.wait(1000);
      cy.info().find("input[name='outboundFlight']").should("not.exist");
    });
  });
});

// ================= PT (sans connexion) =================
describe("PT - Permission testing", () => {
  it("PT-FL-01 : le bouton Flights n'est pas accessible sans connexion", () => {
    cy.visit("/WebTours/index.htm");
    cy.getFrame("body", "navbar").find("input[name='username']").should("exist");
    cy.getFrame("body", "navbar")
      .find("a[href*='search'], img[src*='flights']").should("not.exist");
  });

  it("PT-FL-02 : accès direct à la recherche sans session", () => {
    cy.clearCookies();
    cy.visit("/cgi-bin/reservations.pl?page=welcome", { failOnStatusCode: false });
    cy.get("body").should("not.contain.text", "Find Flight");
  });
});