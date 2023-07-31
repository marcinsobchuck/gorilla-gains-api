import express from 'express';

import { UsersController } from '../controllers/users.controller';

const usersController = new UsersController();

export const usersRouter = express.Router();

usersRouter.get('/', usersController.getAllUsers);
usersRouter.post('/', usersController.createUser);
usersRouter.put('/:id', usersController.updateUser);
usersRouter.delete('/:id', usersController.deleteUser);
