import express from "express";
import { join, resolve } from "path";
import { Route } from "./types";
import { Logger } from "./util/Logger";
import { Util } from "./util/Util";

const app = express();
const port = process.env.PORT || 3000;

app.set("views", resolve("views"));
app.set("view engine", "jsx");

app.engine("jsx", require("express-react-views").createEngine());

app.use(express.static(resolve("public")));

const routeFiles = Util.findNested(join(__dirname, "routes"));
for (const file of routeFiles) {
  const route: Route = require(file).route;
  app.use(route.path, route.router);
}

app.get("/", (req, res) => res.render("pages/index", { title: "Home" }));

app.listen(port, () => Logger.log(`Listening on port http://localhost:${port}/`));
