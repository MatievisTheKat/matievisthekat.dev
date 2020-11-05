import { Router } from "express";
import { authenticate } from "passport";
import User from "../models/User";
import { Route } from "../types";
import ApiResponse from "../util/Response";
import { Util } from "../util/Util";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find().exec();

  new ApiResponse({
    status: 200,
    data: users,
  }).send(res);
});

router.get("/me", authenticate("jwt"), (req, res) => {
  new ApiResponse({ status: req.user ? 200 : 404, data: req.user, message: req.user ? undefined : "No current logged in user" }).send(res);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return new ApiResponse({ status: 400, error: "Missing username or password values" }).send(res);

  const user = await User.findOne({ username }).exec();
  if (!user) return new ApiResponse({ status: 404, error: "No user with that username found" }).send(res);

  const pwdIsValid = await Util.comparePwd(password, user.pwdHash);
  if (!pwdIsValid) return new ApiResponse({ status: 401, error: "Incorrect password" }).send(res);

  new ApiResponse({
    status: 200,
    message: "Successfully logged in",
    data: await Util.issueJwt(user),
  }).send(res);
});

router.get("/:id(\\d+)", async (req, res) => {
  const user = await User.findOne({ id: req.params.id }).exec();

  new ApiResponse({ status: user ? 200 : 404, data: user }).send(res);
});

export const route: Route = {
  path: "/users",
  router,
};
