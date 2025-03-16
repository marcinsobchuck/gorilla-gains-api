/* eslint-disable @typescript-eslint/no-namespace */
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import {
  CreateUserDto,
  EditUserDto,
  UserCredentials,
  UserMethods,
  UserModel,
  UserSchema
} from './types/user.types';

const userSchema = new mongoose.Schema<UserSchema, UserModel, UserMethods>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  surname: {
    type: String
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
  passwordChangedAt: {
    type: Date
  },
  dob: {
    type: Date
  },
  gender: {
    type: String
  },
  weight: {
    type: Number,
    min: 1,
    max: 300
  },
  activityLevel: {
    type: String
  },
  desiredWeight: {
    type: Number,
    min: 1,
    max: 300
  },
  height: {
    type: Number,
    min: 1,
    max: 300
  },
  dueDateWeight: {
    type: Date
  },
  goals: [String],
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  favouriteExercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function (expiresIn?: number) {
  const token = jwt.sign(
    { _id: this.id, isAdmin: this.isAdmin, email: this.email, name: this.name },
    process.env.JWT_SECRET as string,
    {
      ...(expiresIn && { expiresIn: `${expiresIn}m` })
    }
  );
  return token;
};

export const User = mongoose.model<UserSchema, UserModel>('User', userSchema);

export const validateEditUserInfo = (editUserInfoDto: EditUserDto) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
    surname: Joi.string().optional().allow(''),
    dob: Joi.date(),
    gender: Joi.string().valid('male', 'female'),
    height: Joi.number().min(1).max(300),
    weight: Joi.number().min(1).max(300),
    activityLevel: Joi.string(),
    desiredWeight: Joi.number().min(1).max(300),
    dueDateWeight: Joi.date().allow(null),
    goals: Joi.array().items(Joi.string())
  });

  return schema.validate(editUserInfoDto);
};

export const validateCreateUser = (createUserDto: CreateUserDto) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(createUserDto);
};

export const validateCredentials = (credentials: UserCredentials) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(credentials);
};

export const validateForgotPassword = ({ email }: { email: string }) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email()
  });
  return schema.validate({ email });
};
