import { Router } from "express";
import { Route } from "../types";
import { adminOnly, upload } from "../util/middleware";
import ApiResponse from "../util/Response";
import fs from "fs-extra";
import { join } from "path";
import { authenticate } from "passport";

const router = Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.redirect(`/public/cdn/${id}`);
});

router.post("/upload", upload("cdn").array("file"), authenticate("jwt"), adminOnly, async (req, res) => {
  new ApiResponse({ status: 201, data: req.files }).send(res);
});

router.delete("/delete", authenticate("jwt"), adminOnly, async (req, res) => {
  const { name } = req.body;
  const path = join("public", "cdn", name);

  fs.access(path, async (err) => {
    if (err) return new ApiResponse({ status: 404, error: err.message }).send(res);
    else {
      await fs.remove(path);
      new ApiResponse({ status: 200, message: `${name} successfully removed` }).send(res);
    }
  });
});

export const route: Route = {
  path: "/cdn",
  router,
};
