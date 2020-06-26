const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Use middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set public and views dirs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Handle routes
app.use("/api", require("../api/router"));
app.use("/", require("./routes/index"));

// 404 handling
app.use((req, res, next) => {
  res.render("errors/404", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

// 500 handling
app.use((error, req, res, next) => {
  console.log(error);
  if (process.env.DEV)
    res.render("errors/500", {
      user: req.user,
      error,
      success: req.query.success,
      warning: req.query.warning,
    });
  else
    res.render("errors/500", {
      user: req.user,
      error: req.query.error,
      success: req.query.success,
      warning: req.query.warning,
    });
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

String.prototype.toProperCase = function () {
  return this.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
