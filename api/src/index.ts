require("dotenv").config();

import express from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import { Route, Table } from "./types";
import { Logger } from "./util/Logger";
import ApiResponse from "./util/Response";
import util from "./util/util";
import db from "./util/database";
import { User } from "./tables/users";

const app = express();
const port = process.env.PORT || 1234;

app.set("json spaces", 2);

app.use(Logger.logRequest);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

const routeFiles = util.findNested(path.join(__dirname, "routes"));
const routes: Route[] = routeFiles.map((f) => require(f).route).sort((a, b) => b.path.length - a.path.length);

for (const route of routes) {
  app.use(route.path, route.router);
}

app.get("/", (req, res) => {
  new ApiResponse({
    status: 200,
    data: { routes: routes.map((r) => r.path) },
  }).send(res);
});

Logger.log("Generating keys...");
util.saveKeypair(path.resolve("./keys")).then(async (keys) => {
  util.loadObjectToEnv({
    "keys.public": keys.pub,
    "keys.private": keys.pri,
  });

  Logger.log("Generated public and private keys");

  passport.use(
    new JwtStrategy(
      {
        secretOrKey: keys.pub,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        algorithms: ["RS256"],
      },
      (payload, done) => {
        passport.serializeUser((user: User, done) => done(null, user));

        passport.deserializeUser((id: string, done) => {
          util.getUser(id).then((user) => done(null, user));
        });

        util.getUser(payload.sub).then((user) => done(null, user ?? false));
      }
    )
  );

  // TODO: Find way to do this better
  const tableFiles = util.findNested(path.join(__dirname, "tables"));
  const tables = tableFiles.map((f) => require(f) as { table: Table; importance: number }).sort((a, b) => a.importance - b.importance);
  for (const { table } of tables) {
    const query = await db.parseTableToQuery(table);
    if (typeof query === "string") await db.query(query).catch((err) => Logger.error(err));
  }

  app.listen(port, () => Logger.log(`Listening on port http://localhost:${port}/`));
});
