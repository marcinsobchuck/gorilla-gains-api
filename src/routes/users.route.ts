import express from 'express';
import passport from 'passport';

import '../middleware/auth';

import { UsersController } from '../controllers/users.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';
import { admin } from '../middleware/admin';
import { verifyPasswordResetToken } from '../middleware/verifyPasswordResetToken';

const usersController = new UsersController();

export const usersRouter = express.Router();

usersRouter.get(
  '/',
  passport.authenticate('auth', { session: false }),
  usersController.getCurrentUser
);
usersRouter.get(
  '/',
  [passport.authenticate('auth', { session: false }), admin],
  usersController.getAllUsers
);
usersRouter.patch(
  '/',
  passport.authenticate('auth', { session: false }),
  usersController.editUserInfo
);
usersRouter.get(
  ApiEndpoints.USERS_VERIFY_PASSWORD,
  passport.authenticate('auth', { session: false }),
  usersController.verifyUserPassword
);

usersRouter.post(
  ApiEndpoints.USERS_CHANGE_PASSWORD,
  verifyPasswordResetToken,
  usersController.changeUserPassword
);
