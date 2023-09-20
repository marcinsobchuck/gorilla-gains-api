/* eslint-disable @typescript-eslint/no-namespace */
import { Document, Model, Types } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document, UserSchema {}
  }
}

export interface UserSchema {
  name: string;
  email: string;
  password: string;
  age: number;
  weight: number;
  desiredWeight: number;
  height: number;
  dueDate: Date;
  goal: string[];
  activities: Types.ObjectId[];
  isAdmin: boolean;
}

export interface UserMethods {
  generateAuthToken(): string;
}

export type UserModel = Model<UserSchema, object, UserMethods>;

export interface EditUserDto {
  age?: number;
  weight?: number;
  desiredWeight?: number;
  height?: number;
  dueDate?: Date;
  goal?: string[];
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}
