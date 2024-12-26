import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { UsersController } from '../controllers/users.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';
import { admin } from '../middleware/admin';

const usersController = new UsersController();

export const usersRouter = express.Router();

usersRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  usersController.getCurrentUser
);
usersRouter.get(
  '/',
  [passport.authenticate('jwt', { session: false }), admin],
  usersController.getAllUsers
);
usersRouter.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  usersController.editUserInfo
);
usersRouter.get(
  ApiEndpoints.USERS_VERIFY_PASSWORD,
  passport.authenticate('jwt', { session: false }),
  usersController.verifyUserPassword
);
