const axios = require("axios");
const path = require("path");

exports.createPages = async function ({ actions }) {
  return axios
    .post("http://localhost:3000/users/login", { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD })
    .then(async (login) => {
      const data = login.data.data;
      const token = data.token;

      const res = await axios
        .get("http://localhost:3000/cdn/list", {
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
