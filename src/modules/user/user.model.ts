import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
//import * as mongoose from "mongoose";
import { Document, Schema, Model, model, Error} from "mongoose";
import { IUser } from '../../interfaces/user';

export interface IUserModel extends IUser, Document {
  comparePassword(password: string): Promise<Boolean>;
  fullName(): string;
}

export const UserSchema: Schema = new Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },
});

export type AuthToken = {
  accessToken: string,
  kind: string
};

/**
 * Password hash middleware.
 */
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password: string): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err: Error, isMatch: boolean) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });

  })
};

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
