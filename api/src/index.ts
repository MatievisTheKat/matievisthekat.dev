import express from "express";
import { join, resolve } from "path";
import fs from "fs";
import { Route } from "./types";
import { Logger } from "./util/Logger";
import { Util } from "./util/Util";

const app = express();
const port = process.env.PORT || 3000;
const pubPath = resolve("public");

fs.access(pubPath, (err) => {
  if (err) {
    Logger.warn(err);

    fs.mkdir(pubPath, (err) => {
      if (err) {
        Logger.error(err);
        Logger.warn(`Failed to create 'public' directory at ${pubPath}. There should be additional logging above`);
      } else {
        Logger.info(`Create 'public' directory at ${pubPath}`);
      }
    });
  }
});

app.use(express.static(pubPath));

const routeFiles = Util.findNested(join(__dirname, "routes"));
for (const file of routeFiles) {
  const route: Route = require(file).route;
  app.use(route.path, route.router);
}

app.listen(port, () => Logger.log(`Listening on port http://localhost:${port}/`));
