import { Router } from "express";
import { Route } from "../types";
import { auth, upload } from "../util/middleware";
import ApiResponse from "../util/Response";
import fs from "fs-extra";
import { join } from "path";
import { Logger } from "../util/Logger";

const router = Router();
const cdn = join("public", "cdn");

router.get("/list", ...auth(true), async (req, res) => {
  const files = await fs.readdir(cdn);
  new ApiResponse({ status: 200, data: files }).send(res);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const { dl } = req.query;
  const path = `/public/cdn/${id}`;

  if (dl) res.download(`.${path}`);
  else res.redirect(path);
});

router.post("/upload", upload("cdn").array("file"), ...auth(true), async (req, res) => {
  new ApiResponse({ status: 201, data: req.files }).send(res);
});

router.delete("/delete", ...auth(true), async (req, res) => {
  const { name } = req.body;
  const path = join(cdn, name);

  fs.access(path, async (err) => {
    if (err) {
      Logger.error(err);
      return new ApiResponse({ status: 404, error: "Cannot access requested file" }).send(res);
    } else {
      await fs.remove(path);
      new ApiResponse({ status: 200, message: `${name} successfully removed` }).send(res);
    }
  });
});

export const route: Route = {
  path: "/cdn",
  router,
};
