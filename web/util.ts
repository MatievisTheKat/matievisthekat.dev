import Axios from "axios";
import ms from "ms";
import { ChangeEvent, Component } from "react";
import Cookies from "universal-cookie";
import { navigate } from "gatsby";

import { ApiResponse, HTTPStatusCode, User } from "./types";

const cookies = new Cookies();
const jsonFlag = "--JSON";

export function setCookie(name: string, content: any, maxAge?: number) {
  return cookies.set(name, content, { maxAge, path: "/" });
}

export function getCookie(name: string) {
  return cookies.get(name);
}

export function removeCookie(name: string) {
  return cookies.remove(name, { path: "/" });
}

export function setSessionItem(name: string, value: string | Record<string, any>, json?: boolean) {
  return window.sessionStorage.setItem(name, json ? `${jsonFlag}${JSON.stringify(value)}` : value.toString());
}

export function getSessionItem(name: string): null | string | Record<string, any> {
  const value = window.sessionStorage.getItem(name);

  if (value && value.startsWith(jsonFlag)) {
    return JSON.parse(value.slice(jsonFlag.length));
  } else return value;
}

export function removeSessionItem(name: string) {
  return window.sessionStorage.removeItem(name);
}

export function clearSession() {
  return window.sessionStorage.clear();
}

export function validateUsername(username: string): string | undefined {
  let error = undefined;

  if (!username) error = "Please provide a username.";
  else if (username.length < 4) error = "Username must be more than 4 characters.";
  else if (username.length > 18) error = "Username must be less than 16 characters.";
  else if (!/^[A-Za-z0-9_-]*$/.test(username)) error = "Username may only contain letters, numbers, underscores and dashes.";

  if (error) return error;
}

export function validatePassword(password: string): string | undefined {
  let error = undefined;

  if (!password) error = "Please provide a password.";
  else if (password.length < 6) error = "Password must be more than 6 characters.";

  if (error) return error;
}

export function validateEmail(email: string): string | undefined {
  let error = undefined;

  if (!email) error = "Please provide your email address.";
  else if (
    !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.test(
      email
    )
  )
    error = "Please provide a valid email address.";

  return error;
}

export function getCurrentUser(loginIfNotFound?: boolean): User | void {
  if (typeof window === "undefined") return;

  const user: User = cookies.get("user");

  if (!user && loginIfNotFound) {
    navigate(`/login?continueTo=${window.location.pathname}`);
  } else return user;
}

export function getCurrentJwt() {
  return (cookies.get("jwt") || "") as string;
}

export function getUser(jwt: string): Promise<User> {
  return new Promise((res, rej) => {
    Axios.get<ApiResponse>(`${process.env.API}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((user) => res(user.data.data))
      .catch(rej);
  });
}

export function refreshUser(remember?: boolean, expires?: string): Promise<void> {
  return new Promise((res, rej) => {
    const jwt = getCurrentJwt();

    getUser(jwt)
      .then((user) => {
        saveUser(user, jwt, remember, expires);
        res();
      })
      .catch(rej);
  });
}

export function saveUser(user: User, jwt: string, remember?: boolean, expires?: string) {
  setCookie("user", user);

  if (remember) {
    const maxAge = expires ? ms(expires) / 1000 : undefined;
    setCookie("remember", true, maxAge);
    setCookie("jwt", jwt, maxAge);
  } else {
    removeCookie("remember");
    setCookie("jwt", jwt);
  }
}

export function saveLogin(this: Component, jwt: string, expires?: string, overrideRemember?: boolean): Promise<User | void> {
  return new Promise((res, rej) => {
    getUser(jwt)
      .then((user) => {
        if (user) {
          saveUser(user, jwt, overrideRemember, expires);
          res(user);
        } else res();
      })
      .catch(rej);
  });
}

export function onInputChange(key: string, errKey: string, validate: (value: string) => string | undefined) {
  return function (this: Component, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = e.target.value;
    const err = validate(value);
    this.setState({ [key]: value, [errKey]: err });
  };
}

export const httpDefinitions: Record<HTTPStatusCode, string> = {
  // 1xx Informational
  100: "The HTTP 100 Continue informational status response code indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.",
  101: "The HTTP 101 Switching Protocols response code indicates the protocol the server is switching to as requested by a client which sent the message including the Upgrade request header.",
  102: "The HTTP 102 Processing response code is used to inform the client that the server has accepted the complete request, but has not yet completed it.",
  // 2xx Success
  200: "The HTTP 200 OK success status response code indicates that the request has succeeded. A 200 response is cacheable by default.",
  201: "The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource. The new resource is effectively created before this response is sent back and the new resource is returned in the body of the message, its location being either the URL of the request, or the content of the Location header.",
  202: "The HyperText Transfer Protocol (HTTP) 202 Accepted response status code indicates that the request has been accepted for processing, but the processing has not been completed; in fact, processing may not have started yet. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.",
  203: "The HTTP 203 Non-Authoritative Information response status indicates that the request was successful but the enclosed payload has been modified by a transforming proxy from that of the origin server's 200 (OK) response .",
  204: "The HTTP 204 No Content success status response code indicates that the request has succeeded, but that the client doesn't need to go away from its current page. A 204 response is cacheable by default. An ETag header is included in such a response.",
  205: "The HTTP 205 Reset Content response status tells the client to reset the document view, so for example to clear the content of a form, reset a canvas state, or to refresh the UI.",
  206: "The HTTP 206 Partial Content success status response code indicates that the request has succeeded and has the body contains the requested ranges of data, as described in the Range header of the request.",
  207: "The HTTP 207 Multi-Status success status response code indicates that multiple status codes might be appropriate.",
  208: "The HTTP 208 Already Reported success status response code indicates a propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly.",
  226: "The HTTP 208 Already Reported success status response code indicates that the server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
  // 3xx Redirection
  300: "The HTTP 300 Multiple Choices redirect status response code indicates that the request has more than one possible responses. The user-agent or the user should choose one of them. As there is no standardized way of choosing one of the responses, this response code is very rarely used.",
  301: "The HyperText Transfer Protocol (HTTP) 301 Moved Permanently redirect status response code indicates that the resource requested has been definitively moved to the URL given by the Location headers. A browser redirects to this page and search engines update their links to the resource (in 'SEO-speak', it is said that the 'link-juice' is sent to the new URL).",
  302: "The HyperText Transfer Protocol (HTTP) 302 Found redirect status response code indicates that the resource requested has been temporarily moved to the URL given by the Location header. A browser redirects to this page but search engines don't update their links to the resource (in 'SEO-speak', it is said that the 'link-juice' is not sent to the new URL).",
  303: "The HyperText Transfer Protocol (HTTP) 303 See Other redirect status response code indicates that the redirects don't link to the newly uploaded resources, but to another page (such as a confirmation page or an upload progress page). This response code is usually sent back as a result of PUT or POST. The method used to display this redirected page is always GET.",
  304: "The HTTP 304 Not Modified client redirection response code indicates that there is no need to retransmit the requested resources. It is an implicit redirection to a cached resource. This happens when the request method is safe, like a GET or a HEAD request, or when the request is conditional and uses a If-None-Match or a If-Modified-Since header.",
  305: "The HTTP 305 Use Proxy client redirection response code indicates that the requested resource is only available through a proxy. This is a deprecated status due to security concerns.",
  307: "HTTP 307 Temporary Redirect redirect status response code indicates that the resource requested has been temporarily moved to the URL given by the Location headers.",
  308: "The HyperText Transfer Protocol (HTTP) 308 Permanent Redirect redirect status response code indicates that the resource requested has been definitively moved to the URL given by the Location headers. A browser redirects to this page and search engines update their links to the resource (in 'SEO-speak', it is said that the 'link-juice' is sent to the new URL).",
  // 4xx Client error
  400: "The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).",
  401: "The HTTP 401 Unauthorized client error status response code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource. This status is similar to '403', but in this case, authentication is possible.",
  402: "The HTTP 402 Payment Required is a nonstandard client error status response code that is reserved for future use. Sometimes, this code indicates that the request can not be processed until the client makes a payment. Originally it was created to enable digital cash or (micro) payment systems and would indicate that the requested content is not available until the client makes a payment. However, no standard use convention exists and different entities use it in different contexts.",
  403: "The HTTP 403 Forbidden client error status response code indicates that the server understood the request but refuses to authorize it. This status is similar to 401, but in this case, re-authenticating will make no difference. The access is permanently forbidden and tied to the application logic, such as insufficient rights to a resource.",
  404: "The HTTP 404 Not Found client error response code indicates that the server can't find the requested resource. Links that lead to a 404 page are often called broken or dead links and can be subject to link rot. A 404 status code does not indicate whether the resource is temporarily or permanently missing. But if a resource is permanently removed, a 410 (Gone) should be used instead of a 404 status.",
  405: "The HyperText Transfer Protocol (HTTP) 405 Method Not Allowed response status code indicates that the request method is known by the server but is not supported by the target resource.",
  406: "The HyperText Transfer Protocol (HTTP) 406 Not Acceptable client error response code indicates that the server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers, and that the server is unwilling to supply a default representation.",
  407: "The HTTP 407 Proxy Authentication Required client error status response code indicates that the request has not been applied because it lacks valid authentication credentials for a proxy server that is between the browser and the server that can access the requested resource.",
  408: "The HyperText Transfer Protocol (HTTP) 408 Request Timeout response status code means that the server would like to shut down this unused connection. It is sent on an idle connection by some servers, even without any previous request by the client.",
  409: "The HTTP 409 Conflict response status code indicates a request conflict with current state of the target resource. Conflicts are most likely to occur in response to a PUT request. For example, you may get a 409 response when uploading a file which is older than the one already on the server resulting in a version control conflict.",
  410: "The HyperText Transfer Protocol (HTTP) 410 Gone client error response code indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent. If you don't know whether this condition is temporary or permanent, a 404 status code should be used instead.",
  411: "The HyperText Transfer Protocol (HTTP) 411 Length Required client error response code indicates that the server refuses to accept the request without a defined Content-Length header.",
  412: "The HyperText Transfer Protocol (HTTP) 412 Precondition Failed client error response code indicates that access to the target resource has been denied. This happens with conditional requests on methods other than GET or HEAD when the condition defined by the If-Unmodified-Since or If-None-Match headers is not fulfilled. In that case, the request, usually an upload or a modification of a resource, cannot be made and this error response is sent back.",
  413: "The HTTP 413 Payload Too Large response status code indicates that the request entity is larger than limits defined by server; the server might close the connection or return a Retry-After header field.",
  414: "The HTTP 414 URI Too Long response status code indicates that the URI requested by the client is longer than the server is willing to interpret.",
  415: "The HTTP 415 Unsupported Media Type client error response code indicates that the server refuses to accept the request because the payload format is in an unsupported format. The format problem might be due to the request's indicated Content-Type or Content-Encoding, or as a result of inspecting the data directly.",
  416: "The HyperText Transfer Protocol (HTTP) 416 Range Not Satisfiable error response code indicates that a server cannot serve the requested ranges. The most likely reason is that the document doesn't contain such ranges, or that the Range header value, though syntactically correct, doesn't make sense.",
  417: "The HTTP 417 Expectation Failed client error response code indicates that the expectation given in the request's Expect header could not be met.",
  418: "The HTTP 418 I'm a teapot client error response code indicates that the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503. This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014. Some websites use this response for requests they do not wish to handle, such as automated queries.",
  421: "The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.",
  422: "The HyperText Transfer Protocol (HTTP) 422 Unprocessable Entity response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.",
  423: "The HyperText Transfer Protocol (HTTP) 423 Locked response status code indicates that the source or destination resource of a method is locked.",
  424: "The HyperText Transfer Protocol (HTTP) 424 Failed Dependency response status code indicates that the method could not be performed on the resource because the requested action depended on another action and that action failed.",
  426: "The HTTP 426 Upgrade Required client error response code indicates that the server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.",
  428: "The HTTP 428 Precondition Required response status code indicates that the server requires the request to be conditional. Typically, this means that a required precondition header, such as If-Match, is missing. When a precondition header is not matching the server side state, the response should be 412 Precondition Failed.",
  429: 'The HTTP 429 Too Many Requests response status code indicates the user has sent too many requests in a given amount of time ("rate limiting"). A Retry-After header might be included to this response indicating how long to wait before making a new request.',
  431: "The HTTP 431 Request Header Fields Too Large response status code indicates that the server refuses to process the request because the request’s HTTP headers are too long. The request may be resubmitted after reducing the size of the request headers.",
  444: "The HTTP 444 Connection Closed Without Response (non-standard) response status code is used to instruct nginx to close the connection without sending a response to the client, most commonly used to deny malicious or malformed requests.",
  451: "The HyperText Transfer Protocol (HTTP) 451 Unavailable For Legal Reasons client error response code indicates that the user requested a resource that is not available due to legal reasons, such as a web page for which a legal action has been issued.",
  499: "The HyperText Transfer Protocol (HTTP) 499 Client Closed Request client error response code indicates that the client shut off in the middle of processing the request through the server. The 499 error code puts better light that something happened with the client, that is why the request cannot be done.",
  // 5×× Server Error
  500: "The HyperText Transfer Protocol (HTTP) 500 Internal Server Error server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request. This error response is a generic 'catch-all' response. Usually, this indicates the server cannot find a better 5xx error code to response. Sometimes, server administrators log error responses like the 500 status code with more details about the request to prevent the error from happening again in the future.",
  501: "The HyperText Transfer Protocol (HTTP) 501 Not Implemented server error response code means that the server does not support the functionality required to fulfill the request.",
  502: "The HyperText Transfer Protocol (HTTP) 502 Bad Gateway server error response code indicates that the server, while acting as a gateway or proxy, received an invalid response from the upstream server.",
  503: "The HyperText Transfer Protocol (HTTP) 503 Service Unavailable server error response code indicates that the server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time for the recovery of the service.",
  504: "The HyperText Transfer Protocol (HTTP) 504 Gateway Timeout server error response code indicates that the server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request. ",
  505: "The HyperText Transfer Protocol (HTTP) 505 HTTP Version Not Supported response status code indicates that the HTTP version used in the request is not supported by the server.",
  506: "The HyperText Transfer Protocol (HTTP) 506 Variant Also Negotiates response status code may be given in the context of Transparent Content Negotiation. This protocol enables a client to retrieve the best variant of a given resource, where the server supports multiple variants.",
  507: "The HyperText Transfer Protocol (HTTP) 507 Insufficient Storage response status code may be given in the context of the Web Distributed Authoring and Versioning (WebDAV) protocol. It indicates that a method could not be performed because the server cannot store the representation needed to successfully complete the request.",
  508: "The HyperText Transfer Protocol (HTTP) 508 Loop Detected response status code may be given in the context of the Web Distributed Authoring and Versioning (WebDAV) protocol. It indicates that the server terminated an operation because it encountered an infinite loop while processing a request with 'Depth: infinity'. This status indicates that the entire operation failed.",
  509: "The HyperText Transfer Protocol (HTTP) 509 Loop Detected response status code indicates that the site is receiving too much traffic, more than the host can allow.",
  510: "The HyperText Transfer Protocol (HTTP)  510 Not Extended response status code is sent in the context of the HTTP Extension Framework, defined in RFC 2774. In that specification a client may send a request that contains an extension declaration, that describes the extension to be used. If the server receives such a request, but any described extensions are not supported for the request, then the server responds with the 510 status code.",
  511: "The HTTP 511 Network Authentication Required response status code indicates that the client needs to authenticate to gain network access. This status is not generated by origin servers, but by intercepting proxies that control access to the network.",
  599: "The HTTP 599 Network Connect Timeout Error response status code indicates that a network connect timedout behind the proxy to a client in front of the proxy.",
};
