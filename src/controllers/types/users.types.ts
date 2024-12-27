import { Request } from 'express';

import { EditUserDto } from '../../models/types/user.types';

export type EditUserInfoRequest = Request<object, any, EditUserDto>;

export type VerifyUserPasswordRequest = Request<object, any, any, { password: string }>;

export type ChangeUserPasswordRequest = Request<object, any, { password: string }>;
