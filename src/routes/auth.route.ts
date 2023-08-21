import express from 'express';

import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();

export const authRouter = express.Router();

authRouter.post('/', authController.authenticate);
