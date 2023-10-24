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
      const token = await usersService.login(req.body);
      res.send(token);
    } catch (error: any) {
      res.status(401).send(error.message);
    }
  }

  async register(req: CreateUserRequest, res: Response) {
    const { error } = validateCreateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const token = await usersService.register(req.body);
      res.send(token);
    } catch (error: any) {
      res.status(409).send(error.message);
    }
  }
}
