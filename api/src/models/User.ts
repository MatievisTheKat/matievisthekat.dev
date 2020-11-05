import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  createdTimestamp: string;
  pwdHash: string;
}

export default model<IUser>(
  "User",
  new Schema({
    id: { required: true, type: String },
    username: { required: true, type: String },
    createdTimestamp: { required: false, type: String, default: Date.now() },
    pwdHash: { required: true, type: String },
  })
);
