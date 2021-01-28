import fs from "fs-extra";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateKeyPair, createCipheriv, randomBytes } from "crypto";
import { Response } from "express";

import { HTTPStatusCode, KeyPair, UserReview, VerificationLevel } from "../types";
import { User } from "../tables/users";
import { VerificationCode } from "../tables/verification_codes";
import db from "./database";
import mail from "./mail";
import { Review } from "../tables/reviews";
import { Logger } from "./Logger";
import { InternalError } from "./Response";

namespace util {
  export function loadObjectToEnv(obj: object) {
    for (const entry of Object.entries(obj)) {
      if (typeof entry[1] === "object") {
        loadObjectToEnv(entry[1]);
      } else {
        process.env[entry[0]] = entry[1].toString();
      }
    }
    return process.env;
  }

  export function findNested(dir: string, pattern: string = "js") {
    let results: string[] = [];

    fs.readdirSync(dir).forEach((innerDir) => {
      innerDir = path.resolve(dir, innerDir);
      const stat = fs.statSync(innerDir);

      if (stat.isDirectory()) results = results.concat(findNested(innerDir, pattern));

      if (stat.isFile() && innerDir.split(".").pop() === pattern) results.push(innerDir);
    });

    return results;
  }

  export async function getPasswordUsernameMatch(username: string, password: string) {
    const res = await db.query("SELECT * FROM users WHERE username = $1;", [username]);

    const user: User = res.rows[0];
    if (!user) return null;

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) return null;

    return user;
  }

  export function serializePassword(password: string) {
    return new Promise<string>((res, rej) => {
      bcrypt.hash(password, parseInt(process.env["salt-rounds"] as string, 2), (err, hash) => {
        if (err) return rej(err);
        else res(hash);
      });
    });
  }

  export function comparePassword(password: string, hash: string) {
    return new Promise<boolean>((res, rej) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) return rej(err);
        else res(result);
      });
    });
  }

  export function getUser(value: string) {
    return new Promise<User | undefined>((res, rej) => {
      db.query("SELECT * FROM users WHERE id = $1 OR username = $1 OR email = $1;", [value])
        .then((result) => res(result.rows[0]))
        .catch(rej);
    });
  }

  export function updateUser(user: User, update: Record<string, any>) {
    return new Promise<boolean | undefined>((res, rej) => {
      if (update.avatar_url) {
        db.query("UPDATE users SET avatar_url = $1 WHERE id = $2;", [update.avatar_url, user.id])
          .then(() => res(true))
          .catch(rej);
      } else rej("Invalid update props");
    });
  }

  export function createUser(username: string, password: string, email: string) {
    return new Promise<User>(async (res, rej) => {
      const userWithSameEmail = await getUser(email);
      if (userWithSameEmail) return rej({ status: 400, error: "A user with that email already exists" });

      const userWithSameUsername = await getUser(username);
      if (userWithSameUsername) return rej({ status: 400, error: "That username is taken" });

      const hash = await serializePassword(password);

      db.query("INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3);", [username, hash, email])
        .then(async () => {
          const user = (await getUser(username)) as User;
          res(user);
        })
        .catch(rej);
    });
  }

  export function deleteVerificationCode(emailOrCode: string, code?: string) {
    return new Promise<boolean>(async (res, rej) => {
      const verif = await getVerificationCode(emailOrCode, code, true).catch(rej);
      if (!verif) return res(false);

      db.query(
        `DELETE FROM verification_codes WHERE ${code ? "email = $1 AND code = $2" : "email = $1 OR code = $1"}`,
        code ? [emailOrCode, code] : [emailOrCode]
      )
        .then(() => res(true))
        .catch(rej);
    });
  }

  export function updateVerificationStatus(email: string, code: string, level: VerificationLevel) {
    return new Promise<boolean>(async (res, rej) => {
      const verif = await getVerificationCode(email, code);
      if (!verif) return res(false);

      db.query("UPDATE users SET verification = $1 WHERE email = $2;", [level, email])
        .then(async () => {
          await deleteVerificationCode(email, code);
          res(true);
        })
        .catch(rej);
    });
  }

  export function getVerificationCode(emailOrCode: string, code?: string, doNotDeleteOverride?: boolean) {
    return new Promise<VerificationCode | undefined>((res, rej) => {
      db.query(
        `SELECT * FROM verification_codes WHERE ${code ? "email = $1 AND code = $2" : "email = $1 OR code = $1"};`,
        code ? [emailOrCode, code] : [emailOrCode]
      )
        .then(async (result) => {
          if (result.rows[0]) {
            const verif = result.rows[0] as VerificationCode;
            const expired = hasExpired(verif.created_timestamp, verif.expires_in);

            if (expired && !doNotDeleteOverride) {
              await deleteVerificationCode(emailOrCode, code);
              res(undefined);
            } else res(verif);
          } else res(undefined);
        })
        .catch(rej);
    });
  }

  export function createVerificationCode(email: string) {
    return new Promise<VerificationCode>(async (res, rej) => {
      const alreadyExists = await db.query("SELECT * FROM verification_codes WHERE email = $1;", [email]);
      if (alreadyExists.rows[0]) await db.query("DELETE FROM verification_codes WHERE email = $1;", [email]);
      db.query("INSERT INTO verification_codes (email, code) VALUES ($1, $2);", [email, generateRandomCode(255)])
        .then(async () => {
          const verif = (await getVerificationCode(email)) as VerificationCode;

          await mail.send({
            to: email,
            subject: "Verify Email Address | matievisthekat.dev",
            html: `<div style="background-color: rgba(243, 244, 246);text-align: center;font-size: larger;margin-x: 10%;padding: 5%;">Please verify your email address by clicking the button below<br /><br /><a style="background-color: rgba(59, 130, 246); border-radius: 0.25rem; color: rgba(255, 255, 255); padding: 10px; border: none; shadow: 2px 2px rgba(243, 244, 246); text-decoration: none; color: white;" href="${
              process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://new.matievisthekat.dev"
            }/verify?code=${verif.code}" target="_blank" rel="noreferrer">Confirm Address</a></div>`,
          });

          await db.query("UPDATE users SET verification = $1 WHERE email = $2;", ["pending", verif.email]).catch(rej);

          res(verif);
        })
        .catch(rej);
    });
  }

  export function createReview(uid: string, body: string, stars: number) {
    return new Promise<Review>(async (resolve, reject) => {
      const alreadyExists = await getReview({ uid });
      if (alreadyExists) return reject(new Error("A review with that email already exists"));

      db.query("INSERT INTO reviews (uid, body, stars) VALUES ($1, $2, $3);", [uid, body, stars])
        .then(async () => {
          const review = (await getReview({ uid })) as Review;

          db.query("UPDATE users SET review = $1 WHERE id = $2;", [review.id, uid])
            .then(() => resolve(review))
            .catch(reject);
        })
        .catch(reject);
    });
  }

  export function getReviews() {
    return new Promise<UserReview[]>((resolve, reject) => {
      db.query(
        "SELECT r.id, r.body, r.stars, r.created_timestamp, u.admin, u.username, u.avatar_url, u.verification FROM reviews r INNER JOIN users u ON r.uid = u.id;"
      )
        .then((res) => resolve(res.rows))
        .catch(reject);
    });
  }

  export function deleteReview(id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query("DELETE FROM reviews WHERE id = $1;", [id])
        .then(() => resolve())
        .catch(reject);
    });
  }

  export function getReview({ id, uid }: { id: number; uid?: void } | { id?: void; uid: string }) {
    return new Promise<Review | undefined>((resolve, reject) => {
      db.query<Review>(`SELECT * FROM reviews WHERE ${id ? "id" : "uid"} = $1;`, [id || uid])
        .then((res) => resolve(res.rows[0]))
        .catch(reject);
    });
  }

  export function getUserReview({ id, uid }: { id?: void; uid: string } | { id: number; uid?: void }) {
    return new Promise<UserReview | undefined>(async (resolve, reject) => {
      db.query(
        `SELECT u.avatar_url, u.username, u.verification, u.admin, r.stars, r.body, r.created_timestamp, r.id FROM users u INNER JOIN reviews r ON r.uid = u.id AND ${
          id ? "u.review" : "u.id"
        } = $1;`,
        [id || uid]
      )
        .then((res) => resolve(res.rows[0]))
        .catch(reject);
    });
  }

  export function handleErr(this: Response, err: unknown) {
    Logger.error(err);
    InternalError.send(this);
  }

  export function hasExpired(createdTimestamp: Date, expiresIn: number) {
    const created = Date.parse(createdTimestamp.toString());
    return created + expiresIn < Date.now();
  }

  export function generateRandomCode(length?: number) {
    const algo = "aes-256-cbc";
    const iv = randomBytes(16);
    const key = randomBytes(32);
    const value = randomBytes(length ?? 256);

    const cipher = createCipheriv(algo, Buffer.from(key), iv);
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

    return encrypted.toString("hex");
  }

  export function genKeypair(cb: (err: Error | null, pub: string, pri: string) => void) {
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

  export function saveKeypair(dir: string) {
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

      genKeypair((err, pub, pri) => {
        if (err) return rej(err);

        fs.writeFileSync(pubPath, pub);
        fs.writeFileSync(privPath, pri);

        res({ pub, pri });
      });
    });
  }

  export async function issueJwt(userOrId: User | string) {
    let user: User | undefined;

    if (typeof userOrId === "string") {
      user = await getUser(userOrId);
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

  export const httpCodes: Record<HTTPStatusCode, string> = {
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

export default util;
