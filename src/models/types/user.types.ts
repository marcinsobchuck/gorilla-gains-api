/* eslint-disable @typescript-eslint/no-namespace */
import { Document, Model, Types } from 'mongoose';

import { ActivitySchema } from './activity.types';

declare global {
  namespace Express {
    interface User extends Document {
      isAdmin: boolean;
      activities: Types.DocumentArray<ActivitySchema>;
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
  activities: ActivitySchema[];
  isAdmin: boolean;
}

export type UserDocumentProps = {
  activities: Types.DocumentArray<ActivitySchema>;
};

export interface UserMethods {
  generateAuthToken(): string;
}

type UserDocumentOverride = UserDocumentProps & UserMethods;

export type UserModel = Model<UserSchema, object, UserDocumentOverride>;

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
