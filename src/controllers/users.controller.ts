import { Request, Response } from 'express';

import { CreateUserRequest } from './types/users.types';
import { validateUser } from '../models/user';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class UsersController {
  async getAllUsers(req: Request, res: Response) {
    const users = await usersService.getAllUsers();
    res.send(users);
  }

  async createUser(req: CreateUserRequest, res: Response) {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const user = await usersService.createUser(req.body);
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
