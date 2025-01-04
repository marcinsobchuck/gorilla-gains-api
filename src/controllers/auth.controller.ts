import { Request, Response } from 'express';

import {
  CreateUserRequest,
  ForgotPasswordRequest,
  LoginRequest
} from './types/auth.controller.types';
import { validateCreateUser, validateCredentials, validateForgotPassword } from '../models/user';
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

  async forgotPassword(req: ForgotPasswordRequest, res: Response) {
    const { error } = validateForgotPassword(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const response = await usersService.forgotPassword(req.body.email);

      res.send(response);
    } catch (error: any) {
      res.status(401).send(error.message);
    }
  }

  async verifyPasswordResetToken(req: Request, res: Response) {
    res.send(!!req.user);
  }
}
