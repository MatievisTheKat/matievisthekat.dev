import { HTTPStatusCode, ApiResponseOptions } from "../types";
import { Util } from "./Util";
import { Response } from "express";

export default class ApiResponse {
  public status: HTTPStatusCode;
  public statusText: string;
  public message?: string = "";
  public error?: string;
  public data?: any;

  constructor(opts: ApiResponseOptions) {
    this.status = opts.status;
    this.message = opts.message;
    this.error = opts.error;
    this.statusText = Util.httpCodes[this.status];
  }

  public send(res: Response) {
    res.json(this);
  }
}
