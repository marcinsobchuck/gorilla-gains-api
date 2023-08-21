/* eslint-disable @typescript-eslint/no-namespace */
import { Model } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      isAdmin: boolean;
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
  isAdmin: boolean;
}

export interface UserMethods {
  generateAuthToken(): string;
}

export type UserModel = Model<UserSchema, object, UserMethods>;
