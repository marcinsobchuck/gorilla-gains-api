import express from 'express';

import { AuthController } from '../controllers/auth.controller';
import { ApiEndpoints } from '../enum/apiEndpoints.enum';
import { verifyPasswordResetToken } from '../middleware/verifyPasswordResetToken';

const authController = new AuthController();

export const authRouter = express.Router();

authRouter.post(ApiEndpoints.AUTH_LOGIN, authController.login);
authRouter.post(ApiEndpoints.AUTH_REGISTER, authController.register);
authRouter.post(ApiEndpoints.AUTH_FORGOT_PASSWORD, authController.forgotPassword);
authRouter.get(
  ApiEndpoints.AUTH_VERIFY_PASSWORD_RESET_TOKEN,
  verifyPasswordResetToken,
  authController.verifyPasswordResetToken
);
