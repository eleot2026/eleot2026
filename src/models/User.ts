import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash?: string
  role: "admin" | "supervisor"
  createdAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "supervisor"],
      default: "supervisor",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User

