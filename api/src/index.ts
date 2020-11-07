import express from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { Route } from "./types";
import { Logger } from "./util/Logger";
import ApiResponse from "./util/Response";
import { Util } from "./util/Util";
import User, { IUser } from "./models/User";

Util.loadEnv(path.resolve("./.env.json"));

const app = express();
const port = process.env.PORT || 3000;

app.set("json spaces", 2);

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const routeFiles = Util.findNested(path.join(__dirname, "routes"));
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
Util.genKeypair(path.resolve("./keys")).then((keys) => {
  Util.loadObjectToEnv({
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
        passport.serializeUser((user: IUser, done) => {
          done(null, user);
        });

        passport.deserializeUser((id: string, done) => {
          User.findOne({ id })
            .exec()
            .then((user) => {
              if (!user) return done(null, false);
              else done(null, user);
            });
        });

        User.findOne({ id: payload.sub })
          .exec()
          .then((user) => {
            if (!user) return done(null, false);
            else done(null, user);
          });
      }
    )
  );

  mongoose
    .connect(`mongodb://${process.env["db.user"]}:${escape(process.env["db.pwd"] ?? "")}@${process.env["db.host"]}/${process.env["db.name"]}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(({ connections }) => {
      Logger.log(`Connected to MongoDB on ${connections.map((con) => con.host).join(", ")}`);
      app.listen(port, () => Logger.log(`Listening on port http://localhost:${port}/`));
    });
});
