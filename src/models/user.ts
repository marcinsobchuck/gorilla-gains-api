/* eslint-disable @typescript-eslint/no-namespace */
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose, { Model } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      isAdmin: boolean;
    }
  }
}

interface UserSchema {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface UserMethods {
  generateAuthToken(): string;
}

type UserModel = Model<UserSchema, object, UserMethods>;

const userSchema = new mongoose.Schema<UserSchema, UserModel, UserMethods>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, process.env.JWT_SECRET as string);
  return token;
};

export const User = mongoose.model<UserSchema, UserModel>('User', userSchema);

export const validateUser = (user: UserSchema) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
};
