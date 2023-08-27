/* eslint-disable @typescript-eslint/no-namespace */
import { Document, Model, Types } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document {
      isAdmin: boolean;
      activities: Types.ObjectId[];
    }
  }
}

export interface UserSchema {
  name: string;
  email: string;
  password: string;
  age: number;
  weight: number;
  desiredWeight: number;
  dueDate: Date;
  goal: string[];
  activities: Types.ObjectId[];
  isAdmin: boolean;
}

export interface UserMethods {
  generateAuthToken(): string;
}

export type UserModel = Model<UserSchema, object, UserMethods>;

export interface UserDto {
  name: string;
  email: string;
  password: string;
  age: number;
  weight: number;
  desiredWeight: number;
  dueDate: Date;
  goal: string[];
}
