import { Pool, QueryResult } from "pg";
import { Table, TableCol } from "../types";
import { Logger } from "./Logger";

const pool = new Pool({
  host: process.env["db.host"],
  user: process.env["db.user"],
  password: process.env["db.password"],
  port: parseInt(process.env["db.port"] as string),
  database: process.env["db.name"],
});

namespace db {
  export async function parseTableToQuery(table: Table) {
    const colNames = Object.keys(table.cols);
    const tableExists = await doesTableExist(table.name);

    if (!tableExists) {
      return `CREATE TABLE IF NOT EXISTS ${table.name} ( ${colNames.map((name) => generateColumnQuery(name, table.cols[name])).join(",\n")} )`;
    } else {
      return Logger.warn(`Table '${table.name}' already exists`);

      // TODO: Find a way to do this
      /* const { rows } = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", [table.name]);
      const colData: {
        drop?: boolean;
        alter?: boolean;
        add?: boolean;
        name: string;
      }[] = [];

      for (const name of colNames) {
        const colExists = await doesColumnExist(table.name, name);

        if (!colExists) colData.push({ add: true, name });
        else if (colExists && !rows.find((r) => r.column_name === name)) colData.push({ drop: true, name });
        else colData.push({ alter: true, name });
      }

      for (const row of rows) {
        if (!colData.find((c) => c.name === row.column_name)) colData.push({ drop: true, name: row.column_name });
      }

      const adds = colData.filter((cd) => cd.add);
      const alters = colData.filter((cd) => cd.alter);
      const drops = colData.filter((cd) => cd.drop);
      const queries: string[] = [];

      if (adds.length > 0)
        queries.push(
          `ALTER TABLE ${table.name} ${adds.map((a, i) => `${i === 0 ? "ADD " : ""}${generateColumnQuery(a.name, table.cols[a.name])}`).join(",\n")}`
        );
      if (alters.length > 0)
        alters.forEach((a) => queries.push(`ALTER TABLE ${table.name} ALTER COLUMN ${a.name} TYPE ${table.cols[a.name].datatype}`));
      if (drops.length > 0) queries.push(`ALTER TABLE ${table.name} ${drops.map((d, i) => `${i === 0 ? "DROP " : ""}${d.name}`).join(",\n")}`);

      return `${queries.join(";\n")};`; */
    }
  }

  export function generateColumnQuery(name: string, col: TableCol) {
    return `${name} ${col.datatype}${col.unique ? " UNIQUE" : ""}${col.required ? " NOT NULL" : ""}${col.primaryKey ? " PRIMARY KEY" : ""}${
      col.foreignKey ? ` REFERENCES ${col.foreignKey}` : ""
    }${col.default ? ` DEFAULT ${col.default}` : ""}`;
  }

  export function doesColumnExist(tableName: string, colName: string) {
    return new Promise<boolean>((res, rej) => {
      query("SELECT EXISTS ( SELECT FROM information_schema.columns WHERE table_name = $2 AND column_name = $1 );", [colName, tableName])
        .then(({ rows }) => res(rows[0].exists))
        .catch(rej);
    });
  }

  export function doesTableExist(name: string) {
    return new Promise<boolean>((res, rej) => {
      query("SELECT EXISTS ( SELECT FROM information_schema.tables WHERE table_name = $1 );", [name])
        .then(({ rows }) => res(rows[0].exists))
        .catch(rej);
    });
  }

  export function query<T = any>(queryString: string, values?: any[]) {
    return new Promise<QueryResult<T>>((res, rej) => {
      // const start = Date.now();

      pool.query(queryString, values ?? [], (err, result) => {
        if (err) return rej(err);

        // const duration = Date.now() - start;
        // Logger.info(`Executed database query '${Array.isArray(result) ? result.map((r) => r.command).join(", ") : result.command}': ${duration}ms`);

        res(result);
      });
    });
  }
}

export default db;
