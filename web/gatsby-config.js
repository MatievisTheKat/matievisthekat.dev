module.exports = {
  siteMetadata: {
    title: "matievisthekat.dev",
    description: "Freelance prgramming and development services",
    author: "@matievisthekat",
    navTabs: [
      {
        name: "Home",
        slug: "",
      },
      {
        name: "Products",
        slug: "products",
      },
      {
        name: "Services",
        slug: "services",
      },
      {
        name: "Dashboard",
        slug: "dashboard",
      },
    ],
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/assets/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/assets/images/logo.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-postcss",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // "gatsby-plugin-offline",
  ],
};
