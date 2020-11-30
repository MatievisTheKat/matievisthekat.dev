import express, { Router } from "express";
import { Route } from "../types";
import fs from "fs-extra";
import { resolve } from "path";
import ApiResponse from "../util/Response";
import { auth } from "../util/middleware";

const router = Router();
const logs = resolve("logs");
const getLogs = async () => await fs.readdir(logs);

fs.ensureDir(logs);

router.use(...auth(true));
router.use("/file", express.static(logs));

router.get("/", async (req, res) => new ApiResponse({ status: 200, data: await getLogs() }).send(res));

router.get("/:year", async (req, res) => {
  const files = (await getLogs()).filter((f) => f.split("-")[0] === req.params.year);
  if (!files) return new ApiResponse({ status: 404 }).send(res);

  new ApiResponse({ status: 200, data: files }).send(res);
});

router.get("/:year/:month", async (req, res) => {
  const files = (await getLogs()).filter((f) => {
    const parts = f.split("-");
    const year = parts[0];
    const month = parts[1];

    return year === req.params.year && month === req.params.month;
  });

  if (!files) return new ApiResponse({ status: 404 }).send(res);

  new ApiResponse({ status: 200, data: files }).send(res);
});

router.get("/:year/:month/:day", async (req, res) => {
  const { year, month, day } = req.params;

  const file = (await getLogs()).find((f) => {
    const parts = f.split("-");
    const fileYear = parts[0];
    const fileMonth = parts[1];
    const fileDay = parts[2].split(".")[0];

    return fileYear === year && fileMonth === month && fileDay === day;
  });

  if (!file) return new ApiResponse({ status: 404 }).send(res);

  res.redirect(`/logs/file/${year}-${month}-${day}.log`);
});

export const route: Route = {
  path: "/logs",
  router,
};
