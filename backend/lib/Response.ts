import { HTTPStatusCode } from "./types";
import { Util } from "./Util";
import { Response as ExResponse } from "express";

export interface ResponseOptions {
  status: HTTPStatusCode;
  error?: string | undefined;
  message?: string | undefined;
  data?: any;
}

export class Response {
  public statusText: string;
  public status: HTTPStatusCode;
  public error: string | undefined = undefined;
  public message: string | undefined = undefined;
  public data: any = undefined;

  constructor(opts: ResponseOptions) {
    this.status = opts.status;
    this.error = opts.error;
    this.message = opts.message;
    this.data = opts.data;

    this.statusText = Util.httpCodes[this.status];
  }

  public send(res: ExResponse): void {
    res.status(this.status).json(this);
  }
}
