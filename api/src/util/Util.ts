import fs from "fs";
import path from "path";
import { HTTPStatusCode } from "../types";

export class Util {
  public static capitalise(str: string): string {
    return str.length > 0
      ? str
          .split(/ +/gi)
          .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : str;
  }

  public static loadEnv(envPath: string): NodeJS.ProcessEnv {
    const env = require(envPath);
    if (!env) throw new Error("(Util#loadEnv) No environment variables to load");

    return Util.loadObjectToEnv(env);
  }

  public static loadObjectToEnv(obj: object): NodeJS.ProcessEnv {
    for (const entry of Object.entries(obj)) {
      if (typeof entry[1] === "object") {
        Util.loadObjectToEnv(entry[1]);
      } else {
        process.env[entry[0]] = entry[1].toString();
      }
    }
    return process.env;
  }

  public static findNested(dir: string, pattern: string = "js"): string[] {
    let results: string[] = [];

    fs.readdirSync(dir).forEach((innerDir) => {
      innerDir = path.resolve(dir, innerDir);
      const stat = fs.statSync(innerDir);

      if (stat.isDirectory()) results = results.concat(Util.findNested(innerDir, pattern));

      if (stat.isFile() && innerDir.split(".").pop() === pattern) results.push(innerDir);
    });

    return results;
  }

  public static httpCodes: Record<HTTPStatusCode, string> = {
    // 1×× Informational
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    // 2×× Success
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non - authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi - Status",
    208: "Already Reported",
    226: "IM Used",
    // 3×× Redirection
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    // 4×× Client Error
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "Request - URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    444: "Connection Closed Without Response",
    451: "Unavailable For Legal Reasons",
    499: "Client Closed Request",
    // 5×× Server Error
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    509: "Bandwidth Limit Exceeded",
    510: "Not Extended",
    511: "Network Authentication Required",
    599: "Network Connect Timeout Error",
  };
}
