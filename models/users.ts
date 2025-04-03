import { Schema, models, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
  createToken(): string;
}

const SECRET = process.env.JWT_SECRET || "default_secret_key";

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Method to create a JWT token for the user
userSchema.methods.createToken = function (): string {
  return JWT.sign(
    { userId: this._id, role: this.role, name: this.name },
    SECRET,
    { expiresIn: "30d" }
  );
};

export default models.Users || model<IUser>("Users", userSchema);
