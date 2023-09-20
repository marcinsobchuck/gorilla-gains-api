import { Response } from 'express';

import { CreateUserRequest, LoginRequest } from './types/auth.controller.types';
import { validateCreateUser, validateCredentials } from '../models/user';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class AuthController {
  async login(req: LoginRequest, res: Response) {
    const { error } = validateCredentials(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const accessToken = await usersService.login(req.body);
      res.send(accessToken);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  async register(req: CreateUserRequest, res: Response) {
    const { error } = validateCreateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const user = await usersService.register(req.body);
      const token = user.generateAuthToken();
      res.header('Authorization', token).send({
        id: user._id,
        name: user.name,
        email: user.email
      });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}
