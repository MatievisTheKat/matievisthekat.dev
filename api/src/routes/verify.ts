import { Router } from "express";
import { User } from "../tables/users";
import { Route } from "../types";
import { Logger } from "../util/Logger";
import { auth } from "../util/middleware";
import ApiResponse from "../util/Response";
import util from "../util/util";

const router = Router();

router.post("/create", ...auth(), async (req, res) => {
  const user = req.user as User;
  const email = user.email;

  const alreadyExists = await util.getVerificationCode(email);
  if (alreadyExists && !req.body.override) {
    new ApiResponse({ status: 400, error: "Code for that email address already exists" }).send(res);
  } else if (user.verification === "verified") new ApiResponse({ status: 400, error: "You are already verified" }).send(res);
  else {
    util
      .createVerificationCode(email)
      .then((result) => {
        new ApiResponse({ status: 201, data: result }).send(res);
      })
      .catch((err) => {
        Logger.error(err);
        new ApiResponse({ status: 500, error: "Something went wrong on our side" }).send(res);
      });
  }
});

router.get("/view/:code", ...auth(true), (req, res) => {
  util
    .getVerificationCode(req.params.code)
    .then((result) => {
      new ApiResponse({ status: result ? 200 : 404, data: result }).send(res);
    })
    .catch((err) => {
      Logger.error(err);
      new ApiResponse({ status: 500, error: "Something went wrong on our end" }).send(res);
    });
});

router.put("/:code", ...auth(), async (req, res) => {
  const user = req.user as User;
  if (user.verification === "verified") return new ApiResponse({ status: 400, error: "Account already verified" }).send(res);

  util
    .updateVerificationStatus(user.email, req.params.code, "verified")
    .then((result) => {
      if (!result) return new ApiResponse({ status: 404, error: "Invalid verification code" }).send(res);
      else new ApiResponse({ status: 200 }).send(res);
    })
    .catch((err) => {
      Logger.error(err);
      new ApiResponse({ status: 500, error: "Something went wrong on our end" }).send(res);
    });
});

export const route: Route = {
  path: "/verify",
  router,
};
