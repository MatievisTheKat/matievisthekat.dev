import { Router } from "express";
import { Route } from "../types";
import Response from "../util/Response";
import fs from "fs-extra";
import path from "path";

const router = Router();

router.get("/default/random", (req, res) => res.redirect(`/public/avatars/default/${Math.floor(Math.random() * 80)}.webp`));
router.get("/default/:id", (req, res) =>
  res.redirect(`/public/avatars/default/${req.params.id.replace(/.png/g, "")}${req.params.id.endsWith(".webp") ? "" : ".webp"}`)
);
router.get("/default", (req, res) => res.redirect("/public/avatars/default.webp"));

router.get("/", async (req, res) => {
  const fileNames = await fs.readdir(path.resolve("./public/avatars/default/"));
  const files = fileNames.map((f) => `/avatars/default/${f}`);

  new Response({
    status: 200,
    data: files,
  }).send(res);
});

export const route: Route = {
  path: "/avatars",
  router,
};
