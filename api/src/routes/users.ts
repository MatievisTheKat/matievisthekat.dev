import { Router } from "express";
import { authenticate } from "passport";
import { Route } from "../types";
import { Logger } from "../util/Logger";
import { adminOnly } from "../util/middleware";
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

  Util.createUser(username, password, email)
    .then(async (user) => {
      const jwt = await Util.issueJwt(user);
      if (jwt.error) {
        Logger.error(jwt.error);
        return new ApiResponse({ status: 500, error: "Something went wrong on our end" });
      }

      new ApiResponse({
        status: 201,
        message: "User successfully created",
        data: {
          token: jwt.token,
          user,
        },
      }).send(res);
    })
    .catch((err) => {
      if (err.status && err.error) return new ApiResponse(err).send(res);
      else {
        Logger.error(err);
        new ApiResponse({
          status: 500,
          error: "Something went wrong on our end",
        }).send(res);
      }
    });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return new ApiResponse({ status: 400, error: "Missing `username` or `password` values" }).send(res);

  const user = await Util.getUser(username);
  if (!user)
    return new ApiResponse({
      status: 404,
      error: "No user with that username found",
    }).send(res);

  const pwdIsValid = await Util.comparePassword(password, user.password_hash);
  if (!pwdIsValid) return new ApiResponse({ status: 401, error: "Incorrect password" }).send(res);

  new ApiResponse({
    status: 200,
    message: "Successfully logged in",
    data: await Util.issueJwt(user),
  }).send(res);
});

router.put("/update", authenticate("jwt"), async (req, res) => {
  const user = req.user;
  if (!user) return new ApiResponse({ status: 401 });

  const { avatarUrl } = req.body;

  if (avatarUrl) {
    if (user.avatar_url !== avatarUrl) {
      user.avatar_url = avatarUrl;
      await Util.updateUser(user, { avatar_url: avatarUrl });
    }

    new ApiResponse({ status: 200, data: user }).send(res);
  } else new ApiResponse({ status: 400, message: "Invalid or missing update values" }).send(res);
});

router.get("/:id", authenticate("jwt"), adminOnly, async (req, res) => {
  const user = await Util.getUser(req.params.id);

  new ApiResponse({
    status: user ? 200 : 404,
    data: user || undefined,
  }).send(res);
});

export const route: Route = {
  path: "/users",
  router,
};
