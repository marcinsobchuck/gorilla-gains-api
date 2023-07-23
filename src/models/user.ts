import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose, { Model } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
}

interface UserMethods {
  generateAuthToken(): string;
}

type UserModel = Model<User, any, UserMethods>;

const userSchema = new mongoose.Schema<User, UserModel, UserMethods>({
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
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET as string);
  return token;
};

export const User = mongoose.model('User', userSchema);

export const validateUser = (user: User) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
};
