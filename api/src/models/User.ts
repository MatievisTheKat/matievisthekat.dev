import { Document, Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IUser extends Document {
  id: string;
  admin: boolean;
  username: string;
  email: string;
  createdTimestamp: string;
  pwdHash: string;
  avatarUrl: string;
}

export default model<IUser>(
  "User",
  new Schema({
    id: { required: true, type: String, default: uuid() },
    admin: { required: true, type: Boolean, default: false },
    username: { required: true, type: String },
    email: { required: true, type: String },
    pwdHash: { required: true, type: String },
    createdTimestamp: { required: true, type: String, default: Date.now() },
    avatarUrl: { required: true, type: String, default: "/avatars/default/random" },
  })
);
