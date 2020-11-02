import { Router } from "express";
import { Route } from "../types";
import Response from "../util/Response";

const router = Router();

router.get("/", (req, res) =>
  new Response({
    status: 200,
  }).send(res)
);

export const route: Route = {
  path: "/",
  router,
};
