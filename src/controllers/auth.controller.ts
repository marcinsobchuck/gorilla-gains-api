import bcrypt from 'bcrypt';
import { Response } from 'express';
import Joi from 'joi';

import { AuthenticateRequest, UserCredentials } from './types/auth.controller.types';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class AuthController {
  async authenticate(req: AuthenticateRequest, res: Response) {
    const { error } = validateCredentials(req.body);
    const { email, password } = req.body;

    if (error) return res.status(400).send(error.details[0].message);

    const user = await usersService.findByEmail(email);

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