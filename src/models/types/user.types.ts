/* eslint-disable @typescript-eslint/no-namespace */
import { Document, Model, Types } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document, UserSchema {}
  }
}

export interface UserSchema {
  name: string;
  surname: string;
  email: string;
  password: string;
  dob: Date;
  gender: string;
  weight: number;
  activityLevel: string;
  desiredWeight: number;
  height: number;
  dueDateWeight: Date;
  goals: string[];
  activities: Types.ObjectId[];
  isAdmin: boolean;
}

export interface UserMethods {
  generateAuthToken(): string;
}

export type UserModel = Model<UserSchema, object, UserMethods>;

export interface EditUserDto {
  name?: string;
  surname?: string;
  dob?: Date;
  gender?: string;
  height?: string;
  weight?: number;
  activityLevel: string;
  desiredWeight?: number;
  dueDateWeight?: Date;
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
