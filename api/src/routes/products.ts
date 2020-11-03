import { Router } from "express";
import { Route } from "../types";
import Response from "../util/Response";

const router = Router();

router.get("/", (req, res) =>
  new Response({
    status: 200,
    data: [
      {
        name: "Discord Bot",
        slug: "discord-bot",
        price: 5,
      },
    ],
  }).send(res)
);

export const route: Route = {
  path: "/products",
  router,
};
