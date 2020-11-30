import fs from "fs-extra";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateKeyPair, createCipheriv, randomBytes } from "crypto";

import { HTTPStatusCode, KeyPair } from "../types";
import { User } from "../tables/user";
import { VerificationCode } from "../tables/verification_codes";
import db from "../util/database";

export class Util {
  public static capitalise(str: string) {
    return str.length > 0
      ? str
          .split(/ +/gi)
          .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : str;
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

  public static findNested(dir: string, pattern: string = "js") {
    let results: string[] = [];

    fs.readdirSync(dir).forEach((innerDir) => {
      innerDir = path.resolve(dir, innerDir);
      const stat = fs.statSync(innerDir);

      if (stat.isDirectory()) results = results.concat(Util.findNested(innerDir, pattern));

      if (stat.isFile() && innerDir.split(".").pop() === pattern) results.push(innerDir);
    });

    return results;
  }

  public static async getPasswordUsernameMatch(username: string, password: string) {
    const res = await db.query("SELECT * FROM users WHERE username = $1;", [username]);

    const user: User = res.rows[0];
    if (!user) return null;

    const passwordMatch = await Util.comparePassword(password, user.password_hash);
    if (!passwordMatch) return null;

    return user;
  }

  public static serializePassword(password: string) {
    return new Promise<string>((res, rej) => {
      bcrypt.hash(password, parseInt(process.env["salt-rounds"] as string, 2), (err, hash) => {
        if (err) return rej(err);
        else res(hash);
      });
    });
  }

  public static comparePassword(password: string, hash: string) {
    return new Promise<boolean>((res, rej) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) return rej(err);
        else res(result);
      });
    });
  }

  public static getUser(value: string) {
    return new Promise<User | undefined>((res, rej) => {
      db.query("SELECT * FROM users WHERE id = $1 OR username = $1 OR email = $1;", [value])
        .then((result) => res(result.rows[0]))
        .catch(rej);
    });
  }

  public static updateUser(user: User, update: Record<string, any>) {
    return new Promise<boolean | undefined>((res, rej) => {
      if (update.avatar_url) {
        db.query("UPDATE users SET avatar_url = $1 WHERE id = $2;", [update.avatar_url, user.id])
          .then(() => res(true))
          .catch(rej);
      } else rej("Invalid update props");
    });
  }

  public static createUser(username: string, password: string, email: string) {
    return new Promise<User>(async (res, rej) => {
      const userWithSameEmail = await Util.getUser(email);
      if (userWithSameEmail) return rej({ status: 400, error: "A user with that email already exists" });

      const userWithSameUsername = await Util.getUser(username);
      if (userWithSameUsername) return rej({ status: 400, error: "That username is taken" });

      const hash = await Util.serializePassword(password);

      db.query("INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3);", [username, hash, email])
        .then(async () => {
          const user = (await Util.getUser(username)) as User;
          res(user);
        })
        .catch(rej);
    });
  }

  public static getVerificationCode(email: string) {
    return new Promise<VerificationCode>((res, rej) => {
      db.query("SELECT * FROM verification_codes WHERE email = $1;", [email])
        .then((result) => res(result.rows[0]))
        .catch(rej);
    });
  }

  public static createVerificationCode(email: string) {
    return new Promise<VerificationCode>((res, rej) => {
      db.query("INSERT INTO verification_codes (email, code) VALUES ($1, $2);", [email, Util.generateRandomCode(255)])
        .then(async () => {
          const code = await Util.getVerificationCode(email);
          res(code);
        })
        .catch(rej);
    });
  }

  public static generateRandomCode(length?: number) {
    const algo = "aes-256-cbc";
    const iv = randomBytes(16);
    const key = randomBytes(32);
    const value = randomBytes(length ?? 256);

    const cipher = createCipheriv(algo, Buffer.from(key), iv);
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

    return encrypted.toString("hex");
  }

  public static genKeypair(cb: (err: Error | null, pub: string, pri: string) => void) {
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: process.env["keys.passphrase"] as string,
        },
      },
      cb
    );
  }

  public static saveKeypair(dir: string) {
    return new Promise<KeyPair>(async (res, rej) => {
      const pubPath = path.join(dir, "public.key");
      const privPath = path.join(dir, "private.key");

      await fs.ensureDir(dir);

      const privExists = fs.existsSync(privPath);
      const pubExists = fs.existsSync(pubPath);

      if (privExists && pubExists)
        return res({
          pub: fs.readFileSync(pubPath).toString(),
          pri: fs.readFileSync(privPath).toString(),
        });

      Util.genKeypair((err, pub, pri) => {
        if (err) return rej(err);

        fs.writeFileSync(pubPath, pub);
        fs.writeFileSync(privPath, pri);

        res({ pub, pri });
      });
    });
  }

  public static async issueJwt(userOrId: User | string) {
    let user: User | undefined;

    if (typeof userOrId === "string") {
      user = await Util.getUser(userOrId);
    } else user = userOrId;

    if (!user) return { error: "No user found" };

    const id = user.id;
    const expires = "1d";
    const passphrase = process.env["keys.passphrase"] as string;
    const key = process.env["keys.private"] as string;

    const payload = {
      sub: id,
      iat: Date.now(),
    };

    const token = jwt.sign(payload, { key, passphrase }, { expiresIn: expires, algorithm: "RS256" });

    return { token, expires };
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
