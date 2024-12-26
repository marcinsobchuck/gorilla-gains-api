import express from 'express';
import passport from 'passport';

import { AuthController } from '../controllers/auth.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';

import '../middleware/verifyPasswordResetToken';

const authController = new AuthController();

export const authRouter = express.Router();

authRouter.post(ApiEndpoints.AUTH_LOGIN, authController.login);
authRouter.post(ApiEndpoints.AUTH_REGISTER, authController.register);
authRouter.post(ApiEndpoints.AUTH_FORGOT_PASSWORD, authController.forgotPassword);
authRouter.get(
  ApiEndpoints.AUTH_VERIFY_PASSWORD_RESET_TOKEN,
  (req, res, next) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: Express.User | false | null, info: { message: string }) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json(info?.message || 'Unauthorized');
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  authController.verifyPasswordResetToken
);
