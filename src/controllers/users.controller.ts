import { Request, Response } from 'express';

import { validateUser } from '../models/user';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class UsersController {
  async getAllUsers(req: Request, res: Response) {
    const users = await usersService.getAllUsers();
    res.send(users);
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password, age, weight, desiredWeight, goal, dueDate } = req.body;
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const user = await usersService.createUser(
        name,
        email,
        password,
        dueDate,
        age,
        weight,
        desiredWeight,
        goal
      );
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

  async updateUser(req: Request, res: Response) {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await usersService.updateUser(req.params.id, req.body.name, req.body.phone);

    if (!user) return res.status(404).send('There is no user with the given ID');

    res.send(user);
  }

  async deleteUser(req: Request, res: Response) {
    const user = await usersService.deleteUser(req.params.id);

    if (!user) return res.status(404).send('There is no user with the given ID');

    res.send(user);
  }
}
