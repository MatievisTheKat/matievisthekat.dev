import { Pool, QueryResult } from "pg";
import { Table } from "../types";
import { Logger } from "./Logger";

const pool = new Pool({
  host: process.env["db.host"],
  user: process.env["db.user"],
  password: process.env["db.password"],
  port: parseInt(process.env["db.port"] as string),
  database: process.env["db.name"],
});

export function parseTableToQuery(table: Table) {
  const colNames = Object.keys(table.cols);
  return `CREATE TABLE IF NOT EXISTS ${table.name} (
    ${colNames
      .map((name) => {
        const col = table.cols[name];
        return `${name} ${col.datatype}${col.required ? " NOT NULL" : ""}${col.primaryKey ? " PRIMARY KEY" : ""}${
          col.default ? ` DEFAULT '${col.default}'` : ""
        }`;
      })
      .join(",\n")}
  )`;
}

export default {
  query: (queryString: string, values?: any[]): Promise<QueryResult<any>> => {
    return new Promise((res, rej) => {
      const start = Date.now();

      pool.query(queryString, values ?? [], (err, result) => {
        if (err) return rej(err);

        const duration = Date.now() - start;
        Logger.info(`Executed database query '${result.command}': ${duration}ms`);

        res(result);
      });
    });
  },
};
