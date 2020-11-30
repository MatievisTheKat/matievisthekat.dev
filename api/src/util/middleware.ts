import { NextFunction, Request, Response } from "express";
import fs from "fs-extra";
import multer from "multer";
import { authenticate } from "passport";
import { join } from "path";
import shortid from "shortid";
import { MiddlewareFunction } from "../types";
import ApiResponse from "./Response";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.admin) next();
  else new ApiResponse({ status: 401, error: "This endpoint requires admin credentials" }).send(res);
}

export function auth(admin?: boolean): MiddlewareFunction[] {
  if (!admin) return [authenticate("jwt")];
  else return [authenticate("jwt"), adminOnly];
}

export function upload(subdir: string): multer.Multer {
  const dest = join("public", subdir);
  fs.ensureDir(dest);

  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dest);
      },
      filename: function (req, file, cb) {
        const nameParts = file.originalname.split(".");
        const ext = nameParts.pop();
        const name = nameParts.join(".");

        cb(null, `${name}_${shortid.generate()}.${ext}`);
      },
    }),
  });
}
