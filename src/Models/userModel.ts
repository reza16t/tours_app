import { Schema, model } from "mongoose";
import { IUser, Role } from "../types";

const userSchema = new Schema<IUser>({
   name: { type: String, required: true },

   password: {
      type: String,
      required: true,
      match: [
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
         "Your password should have at minimum eight and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ],
   },
   email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [/^([\w])+(@)+([\w])+(\.)+([a-z]{1,4})$/, "Your email is invalid"],
   },
   avatar: String,
});
userSchema.pre("save", function () {
   this.active = false;
   this.role = Role.User;
});
export const User = model<IUser>("User", userSchema);
