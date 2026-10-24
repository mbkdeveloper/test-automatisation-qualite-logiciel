const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    charts: true,
    reportPageTitle: "Rapport tests WebTours",
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  video: false,

  e2e: {
    baseUrl: "http://127.0.0.1:1080",
    chromeWebSecurity: false,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
    },
  },
});
