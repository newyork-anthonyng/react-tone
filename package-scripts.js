const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    build: "webpack",

    lint: "eslint src/",

    pretty: "prettier --write src/**.js",

    test: {
      default: "jest",

      cover: "jest --coverage",

      watch: "jest --watch"
    },

    validate: {
      description: "Script run in Travis",
      script: npsUtils.concurrent.nps("test.cover", "lint", "build"),
    },

    afterSuccess: "codecov"
  }
};
