import { NextFunction, Request, Response } from "express";
import ApiResponse from "./Response";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.admin) next();
  else new ApiResponse({ status: 401, error: "This endpoint requires admin credentials" }).send(res);
}
