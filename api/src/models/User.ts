import { Document, Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  createdTimestamp: string;
  pwdHash: string;
}

export default model<IUser>(
  "User",
  new Schema({
    id: { required: true, type: String, default: uuid() },
    username: { required: true, type: String },
    email: { required: true, type: String },
    pwdHash: { required: true, type: String },
    createdTimestamp: { required: true, type: String, default: Date.now() },
  })
);
