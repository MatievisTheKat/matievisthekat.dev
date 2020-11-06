/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it
exports.onClientEntry = () => {
  require("./src/assets/css/global.css")
  require("./src/assets/css/tailwind.css");
};
