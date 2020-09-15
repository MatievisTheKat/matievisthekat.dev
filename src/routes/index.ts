import { Router } from "express";
import { Route } from "../types";

const router = Router();

router.get("/", (req, res) => res.render("pages/index", { title: "Home" }));

export const route: Route = {
  path: "/",
  router,
};
