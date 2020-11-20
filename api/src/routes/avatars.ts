import { Router } from "express";
import { Route } from "../types";

const router = Router();

router.get("/default/random", (req, res) => res.redirect(`/public/avatars/default/${Math.floor(Math.random() * 80)}.png`));
router.get("/default/:id", (req, res) => res.redirect(`/public/avatars/default/${req.params.id}.png`));

export const route: Route = {
  path: "/avatars",
  router,
};
