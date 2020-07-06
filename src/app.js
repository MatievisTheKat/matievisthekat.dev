const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const app = express();

// Use middleware
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set public and views dirs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  var token = req.csrfToken();
  res.cookie("_csrf", token);
  next();
});

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
app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "EBADCSRFTOKEN")
    return res.render("errors/403", {
      user: req.user,
      error: req.query.error,
      err: "Invalid CSRF token",
      success: req.query.success,
      warning: req.query.warning,
    });
  if (process.env.DEV)
    res.render("errors/500", {
      user: req.user,
      error: req.query.error,
      err,
      success: req.query.success,
      warning: req.query.warning,
    });
  else
    res.render("errors/500", {
      user: req.user,
      error: req.query.error,
      err: "",
      success: req.query.success,
      warning: req.query.warning,
    });
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
