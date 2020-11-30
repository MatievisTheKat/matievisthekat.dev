import { HTTPStatusCode, ApiResponseOptions } from "../types";
import util from "./Util";
import { Response } from "express";

export default class ApiResponse {
  public status: HTTPStatusCode;
  public statusText: string;
  public message?: string;
  public error?: string;
  public data?: any;

  constructor(opts: ApiResponseOptions) {
    this.status = opts.status;
    this.statusText = util.httpCodes[this.status];
    this.message = opts.message;
    this.error = opts.error;
    this.data = opts.data;
  }

  public send(res: Response) {
    res.status(this.status).json(this);
  }
}
