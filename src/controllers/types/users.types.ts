import { Request } from 'express';

import { UserDto } from '../../models/types/user.types';

export type CreateUserRequest = Request<object, any, UserDto>;
