import Router from "express";
import { Route, Response } from "../../lib";
const router = Router();

router.get("/", (req, res) => {
  new Response({
    status: 200,
    message: "hallo",
  }).send(res);
});

export const info: Route = {
  path: "/",
  router,
};
