const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

exports.createPages = async function ({ actions }) {
  return axios
    .post(`${process.env.API}/users/login`, { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD })
    .then(async (login) => {
      const data = login.data.data;
      const token = data.token;

      const res = await axios
        .get(`${process.env.API}/cdn/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(console.error);

      if (!res) return;

      const files = res.data.data;
      for (const file of files) {
        actions.createPage({
          path: `/cdn/${file}`,
          component: path.resolve(`src/templates/cdn.tsx`),
          context: { file },
        });
      }
    })
    .catch(console.error);
};

exports.onPostBuild = async function () {
  const public = path.join(__dirname, "public");
  await fs.copy(public, process.env.POST_BUILD_DIR, { overwrite: true });
};
