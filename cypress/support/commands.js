Cypress.Commands.add("getFrame", (...names) => {
  let chain = cy.get("frame[name='" + names[0] + "']")
    .its("0.contentDocument.body").should("not.be.empty").then(cy.wrap);
  names.slice(1).forEach((n) => {
    chain = chain
      .find("frame[name='" + n + "']")
      .its("0.contentDocument.body").should("not.be.empty").then(cy.wrap);
  });
  return chain;
});