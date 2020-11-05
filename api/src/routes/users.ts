import { Router } from "express";
import { authenticate } from "passport";
import User from "../models/User";
import { Route } from "../types";
import { Logger } from "../util/Logger";
import ApiResponse from "../util/Response";
import { Util } from "../util/Util";

const router = Router();

router.get("/me", authenticate("jwt"), (req, res) => {
  new ApiResponse({ status: req.user ? 200 : 404, data: req.user, message: req.user ? undefined : "No current logged in user" }).send(res);
});

router.post("/register", async (req, res) => {
  const { email: uncleanEmail, username, password, confirmPassword } = req.body;
  const email = uncleanEmail.toLowerCase();

  if (!email || !username || !password || !confirmPassword)
    return new ApiResponse({
      status: 400,
      error: `Missing ${!username ? `username, ` : ""}${!email ? `email, ` : ""}${!password ? `password, ` : ""}${
        !confirmPassword ? `confirmPassword` : ""
      } value(s)`,
    }).send(res);

  if (password !== confirmPassword) return new ApiResponse({ status: 400, error: "Passwords do not match" }).send(res);

  const userWithSameCreds = (await User.find().exec()).find((u) => u.username === username || u.email === email);
  if (userWithSameCreds)
    return new ApiResponse({
      status: 403,
      error: "A user with that username or email already exists",
    }).send(res);

  const pwdHash = await Util.serializePwd(password);
  const user = new User({ username, email, pwdHash });
  const jwt = await Util.issueJwt(user);
  if (jwt.error) {
    Logger.error(jwt.error);
    return new ApiResponse({ status: 500, error: "Something went wrong on our end" });
  }

  user
    .save()
    .then(async (saved) => {
      new ApiResponse({
        status: 201,
        message: "User successfully created",
        data: {
          token: jwt.token,
          user: saved,
        },
      }).send(res);
    })
    .catch((err) => {
      Logger.error(err);
      new ApiResponse({
        status: 500,
        error: "Something went wrong on our end",
      }).send(res);
    });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return new ApiResponse({ status: 400, error: "Missing `username` or `password` values" }).send(res);

  const user = await User.findOne({ username }).exec();
  if (!user)
    return new ApiResponse({
      status: 404,
      error: "No user with that username found",
    }).send(res);

  const pwdIsValid = await Util.comparePwd(password, user.pwdHash);
  if (!pwdIsValid) return new ApiResponse({ status: 401, error: "Incorrect password" }).send(res);

  new ApiResponse({
    status: 200,
    message: "Successfully logged in",
    data: await Util.issueJwt(user),
  }).send(res);
});

router.get("/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id }).exec();

  new ApiResponse({
    status: user ? 200 : 404,
    data: user || undefined,
  }).send(res);
});

export const route: Route = {
  path: "/users",
  router,
};
