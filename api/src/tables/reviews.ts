import { Table } from "../types";

export interface Review {
  id: number;
  body: string;
  uid: string;
  created_timestamp: Date;
  stars: number;
}

export const importance = 2;

export const table: Table = {
  name: "reviews",
  cols: {
    id: {
      datatype: "SERIAL",
      primaryKey: true,
    },
    body: {
      datatype: "TEXT",
      required: true,
    },
    uid: {
      datatype: "TEXT",
      required: true,
      unique: true,
      foreignKey: "users(id)",
    },
    created_timestamp: {
      datatype: "TIMESTAMPTZ",
      required: true,
      default: "CURRENT_TIMESTAMP",
    },
    stars: {
      datatype: "INT",
      required: true,
    },
  },
};
