import bcrypt from 'bcrypt';
import express from 'express';
import Joi from 'joi';

import { User } from '../models/user';

interface UserCredentials {
  email: string;
  password: string;
}

export const authRouter = express.Router();

authRouter.post('/', async (req, res) => {
  const { error } = validateCredentials(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');
  const token = user.generateAuthToken();
  res.send(token);
});

export const validateCredentials = (credentials: UserCredentials) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(credentials);
};
