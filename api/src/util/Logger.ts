import chalk from "chalk";
import moment from "moment";
import { NextFunction, Request, Response } from "express";
import onFinished from "on-finished";
import fs from "fs-extra";
import { join, resolve } from "path";
import { EventEmitter } from "events";

const typeToColour: Record<string, string> = {
  log: chalk.bold("LOG"),
  warn: chalk.yellow("WARN"),
  info: chalk.green("INFO"),
  error: chalk.red("ERROR"),
};

export class LogStream extends EventEmitter {
  constructor() {
    super();
  }

  write(content: any) {
    this.emit("write", content);
  }

  close() {
    this.emit("close");
  }
}

const writer = getLogStream();

export class Logger {
  private static get date(): string {
    return moment().format("DD/MM/YYYY HH:mm:ss");
  }

  private static calcSpace(logType: string): string {
    return " ".repeat(10 - logType.length);
  }

  private static formatHeader(logType: string): string {
    return `${chalk.grey(Logger.date)}   ${typeToColour[logType]}${Logger.calcSpace(logType)}`;
  }

  public static log(msg: unknown): void {
    console.log(`${Logger.formatHeader("log")}${msg}`);
  }

  public static warn(msg: unknown): void {
    console.log(`${Logger.formatHeader("warn")}${msg}`);
  }

  public static info(msg: unknown): void {
    console.log(`${Logger.formatHeader("info")}${msg}`);
  }

  public static error(msg: unknown): void {
    console.log(`${Logger.formatHeader("error")}${msg}`);
  }

  public static logRequest(req: Request, res: Response, next: NextFunction): void {
    const path = req.path;
    const startAt = Date.now();

    onFinished(res, (err, msg) => {
      const duration = Date.now() - startAt;
      const status = msg.statusCode;

      console.log(
        `${chalk.grey(Logger.date)}   ${chalk.cyan(req.method)}${Logger.calcSpace(req.method)}${duration}ms - ${chalk.yellow(status)} - ${path}`
      );

      writer.write(`${Logger.date}  ${req.method}${Logger.calcSpace(req.method)}${duration}ms - ${status} - ${path}`);
    });

    next();
  }
}

function getLogStream(): LogStream {
  const dir = resolve("logs");
  const file = join(dir, `${moment().format("YYYY-MM-DD")}.log`);
  const logStream = new LogStream();

  (async () => {
    const previousLogs = await fs.readFile(file).catch(() => {});
    const stream = fs.createWriteStream(file);

    if (previousLogs) {
      stream.write(previousLogs);
      stream.write("\n\n#<--- NEW PROCESS --->#\n\n\n");
    }

    logStream
      .on("write", (content) => {
        stream.write(content);
        stream.write("\n");
      })
      .on("close", () => stream.close());
  })();

  return logStream;
}
