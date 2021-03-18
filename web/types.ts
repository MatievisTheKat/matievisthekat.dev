export type VerificationLevel = "not_sent" | "pending" | "verified";

export interface User {
  username: string;
  admin?: boolean;
  email: string;
  id: string;
  password_hash: string;
  created_timestamp: string;
  avatar_url: string;
}

export interface Review {
  id: number;
  body: string;
  uid: string;
  created_timestamp: string;
  stars: number;
}

export interface UserReview extends Review {
  username: string;
  verification: VerificationLevel;
  avatar_url: string;
  admin: boolean;
}

export interface FileResponse {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export interface ApiResponse {
  status: HTTPStatusCode;
  statusText: string;
  data?: any;
  error?: string;
  message?: string;
}

export interface Tab {
  name: string;
  slug: string;
  admin?: boolean;
}

export interface PrecompiledCss {
  name: string;
  styles: string;
}

export interface BaseLoaderProps {
  colour?: string;
  loading?: boolean;
  css?: string | PrecompiledCss;
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

export const httpPairs: Record<HTTPStatusCode, string> = {
  // 1xx Informational
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  // 2xx Success
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
  // 3xx Redirection
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  // 4xx Client Error
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
  // 5xx Server error
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
