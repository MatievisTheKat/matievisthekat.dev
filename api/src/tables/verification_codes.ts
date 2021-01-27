import { Table } from "../types";

export interface VerificationCode {
  code: string;
  email: string;
  created_timestamp: Date;
  expires_in: number;
}

export const importance = 1;

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
      default: 60 * 60 * 1000,
    },
  },
};
