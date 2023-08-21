import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Joi from 'joi';

import { UserCredentials } from './types/auth.controller.types';
import { User } from '../models/user';

export class AuthController {
  async authenticate(req: Request, res: Response) {
    const { error } = validateCredentials(req.body);
    const { email, password } = req.body;

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    res.send(token);
  }
}

const validateCredentials = (credentials: UserCredentials) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(credentials);
};
