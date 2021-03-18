module.exports = {
  siteMetadata: {
    title: "matievisthekat.dev",
    description: "Freelance developing and tutoring services",
    author: "@matievisthekat",
    navTabs: [
      { name: "Home", slug: "" },
      { name: "Development", slug: "development" },
      { name: "Tutoring", slug: "tutoring" },
      { name: "Reviews", slug: "reviews" },
      { name: "CDN", slug: "cdn", admin: true },
    ],
    socialLinks: [
      { name: "GitHub", url: "https://github.com/MatievisTheKat", slug: "github" },
      { name: "Twitter", url: "https://twitter.com/matievisthekat", slug: "twitter" },
      { name: "LinkedIn", url: "https://linkedin.com/in/matievisthekat/", slug: "linkedin" },
      { name: "Facebook", url: "https://facebook.com/matthew.stead.9469/", slug: "facebook" },
      { name: "Reddit", url: "https://reddit.com/u/MatievisTheKat", slug: "reddit" },
      { name: "Instagram", url: "https://instagram.com/matievisthekat/", slug: "instagram" },
      { name: "YouTube", url: "https://youtube.com/channel/UCMgFIRIW3WaAotLMqoFFTTw", slug: "youtube" },
      { name: "Discord", url: "https://discord.gg/t65hRpd", slug: "discord" },
      { name: "Email", url: "mailto:matthew@matievisthekat.dev", slug: "email" },
    ],
    userMenuLinks: [
      { name: "Profile", url: "/me" },
      { name: "Settings", url: "/me/settings" },
    ],
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "css",
        path: `${__dirname}/src/assets/css`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "fonts",
        path: `${__dirname}/src/assets/fonts`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/assets/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "matievisthekat.dev",
        short_name: "matievisthekat",
        start_url: "/",
        background_color: "#808B96",
        theme_color: "#73C6B6",
        display: "minimal-ui",
        icon: "src/assets/images/app-logo.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-postcss",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    "gatsby-plugin-offline",
  ],
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
  },
};
