describe("Itinerary", () => {
  beforeEach(() => {
    cy.login();
  });

  // ---------- FT ----------
  it("FT-IT-01 : ouvrir la page Itinerary", () => {
    cy.openItinerary();
    cy.getFrame("body", "info").should("exist");
    cy.getFrame("body", "info").should("contain.text", "Itinerary");
  });

  it("FT-IT-02 : un vol réservé apparaît dans Itinerary", () => {
    cy.bookFlight();
    cy.openItinerary();
    cy.getFrame("body", "info").should("not.contain.text", "No flights");
  });

  // ---------- ET ----------
  it("ET-IT-01 : itinerary sans réservation", () => {
    cy.openItinerary();
    cy.getFrame("body", "info").should("contain.text", "No flights");
  });

  // ---------- PT ----------
  it("PT-IT-01 : accès direct sans être connecté", () => {
    cy.clearCookies();
    cy.visit("/cgi-bin/welcome.pl?page=itinerary", { failOnStatusCode: false });
    cy.get("body").should("not.contain.text", "Flights List");
  });
});