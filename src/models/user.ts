/* eslint-disable @typescript-eslint/no-namespace */
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import { CreateUserDto, EditUserDto, UserMethods, UserModel, UserSchema } from './types/user.types';

const userSchema = new mongoose.Schema<UserSchema, UserModel, UserMethods>({
  name: {
    type: String,
    required: true,
    minlength: 3,
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
  age: {
    type: Number,
    min: 1,
    max: 200
  },
  weight: {
    type: Number,
    min: 1,
    max: 300
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
  dueDate: {
    type: Date
  },
  goal: [String],
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, process.env.JWT_SECRET as string);
  return token;
};

export const User = mongoose.model<UserSchema, UserModel>('User', userSchema);

export const validateEditUserInfo = (editUserInfoDto: EditUserDto) => {
  const schema = Joi.object({
    age: Joi.number().min(1).max(200),
    weight: Joi.number().min(1).max(300),
    desiredWeight: Joi.number().min(1).max(300),
    dueDate: Joi.date(),
    height: Joi.number().min(1).max(300),
    goal: Joi.array().items(Joi.string())
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
