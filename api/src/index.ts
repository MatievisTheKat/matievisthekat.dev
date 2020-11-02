import express from "express";
import { join, resolve } from "path";
import { Route } from "./types";
import { Logger } from "./util/Logger";
import { Util } from "./util/Util";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(resolve("public")));

const routeFiles = Util.findNested(join(__dirname, "routes"));
for (const file of routeFiles) {
  const route: Route = require(file).route;
  app.use(route.path, route.router);
}

app.listen(port, () => Logger.log(`Listening on port http://localhost:${port}/`));
