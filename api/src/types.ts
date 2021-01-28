import { NextFunction, Router, Request, Response } from "express";
import { User as CustomUser } from "./tables/users";

export interface UserReview {
  id: number;
  avatar_url: string;
  username: string;
  verification: VerificationLevel;
  admin: boolean;
  stars: number;
  body: string;
  created_timestamp: Date;
}

export interface Route {
  path: string;
  router: Router;
}

export interface Table {
  name: string;
  cols: {
    [key: string]: TableCol;
  };
}

export interface TableCol {
  datatype: string;
  default?: any;
  primaryKey?: boolean;
  foreignKey?: string;
  required?: boolean;
  unique?: boolean;
}

export interface ApiResponseOptions {
  status: HTTPStatusCode;
  message?: string;
  error?: string;
  data?: any;
}

export interface KeyPair {
  pub: string;
  pri: string;
}

export type VerificationLevel = "not_sent" | "pending" | "verified";

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;

declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}

export type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 444
  | 451
  | 499
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511
  | 599;
