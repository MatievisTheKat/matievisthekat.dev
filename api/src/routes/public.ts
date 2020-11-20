import express, { Router } from "express";
import { Route } from "../types";

const router = Router();

router.use("/", express.static("./public"));

export const route: Route = {
  path: "/public",
  router,
};
