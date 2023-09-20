import { Request } from 'express';

import { CreateUserDto, UserCredentials } from '../../models/types/user.types';

export type LoginRequest = Request<object, any, UserCredentials>;

export type CreateUserRequest = Request<object, any, CreateUserDto>;
