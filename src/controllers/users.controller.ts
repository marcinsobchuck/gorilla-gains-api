import { Request, Response } from 'express';

import { EditUserInfoRequest } from './types/users.types';
import { validateEditUserInfo } from '../models/user';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class UsersController {
  async getAllUsers(req: Request, res: Response) {
    const users = await usersService.getAllUsers();
    res.send(users);
  }

  async getCurrentUser(req: Request, res: Response) {
    if (req.user) {
      try {
        const currentUser = await usersService.getCurrentUser(req.user);
        res.send(currentUser);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    }
  }

  async editUserInfo(req: EditUserInfoRequest, res: Response) {
    const { error } = validateEditUserInfo(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    if (req.user) {
      try {
        const user = await usersService.editUserInfo(req.user, req.body);
        res.send(user);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    }
  }
}
