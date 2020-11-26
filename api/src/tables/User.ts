import { v4 as uuid } from "uuid";
import { Table } from "../types";

export interface User {
  id: string;
  admin: boolean;
  username: string;
  email: string;
  created_timestamp: string;
  password_hash: string;
  avatar_url: string;
}

export const table: Table = {
  name: "users",
  cols: {
    id: {
      datatype: "text",
      default: uuid(),
      required: true,
      primaryKey: true,
    },
    admin: {
      datatype: "boolean",
      default: false,
    },
    username: {
      datatype: "text",
    },
    email: {
      datatype: "text",
      required: true,
    },
    password_hash: {
      datatype: "text",
      required: true,
    },
    created_timestamp: {
      datatype: "text",
      default: Date.now().toString(),
      required: true,
    },
    avatar_url: {
      datatype: "text",
      default: "/avatars/default",
      required: true,
    },
  },
};
