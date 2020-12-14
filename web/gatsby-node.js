const path = require("path");
const fs = require("fs-extra");

exports.onPostBuild = async function () {
  const public = path.join(__dirname, "public");
  if (process.env.POST_BUILD_DIR) await fs.copy(public, process.env.POST_BUILD_DIR, { overwrite: true });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /peerjs/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
