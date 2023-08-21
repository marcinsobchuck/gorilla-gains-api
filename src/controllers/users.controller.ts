import { Request, Response } from 'express';

import { validateUser } from '../models/user';
import { UserService } from '../services/users.service';

const userService = new UserService();

export class UsersController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.send(users);
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password, age, weight, desiredWeight, goal, dueDate } = req.body;
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
      const user = await userService.createUser(
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

    const user = await userService.updateUser(req.params.id, req.body.name, req.body.phone);

    if (!user) return res.status(404).send('There is no user with the given ID');

    res.send(user);
  }

  async deleteUser(req: Request, res: Response) {
    const user = await userService.deleteUser(req.params.id);

    if (!user) return res.status(404).send('There is no user with the given ID');

    res.send(user);
  }
}
