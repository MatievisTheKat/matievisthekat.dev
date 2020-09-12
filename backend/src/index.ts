import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { Util, Route, Logger } from "../lib";
import { join, resolve } from "path";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Util.loadEnv(resolve("./.env.json"));

const routeFiles = Util.findNested("./routes/");
for (const file of routeFiles) {
  const route: Route = require(file).default;
  app.use(route.path, route.router);
}

app.listen(port, () => Logger.log(`Backend listening on port ${port}`));
