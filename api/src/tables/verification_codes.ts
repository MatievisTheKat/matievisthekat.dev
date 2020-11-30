import { Table } from "../types";

export interface VerificationCode {
  code: string;
  email: string;
  created_timestamp: string;
  expires_in: number;
}

export const table: Table = {
  name: "verification_codes",
  cols: {
    code: {
      datatype: "TEXT",
      required: true,
      primaryKey: true,
    },
    email: {
      datatype: "TEXT",
      required: true,
      unique: true,
      foreignKey: "users(email)",
    },
    created_timestamp: {
      datatype: "TIMESTAMPTZ",
      required: true,
      default: "CURRENT_TIMESTAMP",
    },
    expires_in: {
      datatype: "INT",
      required: true,
      default: 10 * 60 * 1000,
    },
  },
};
