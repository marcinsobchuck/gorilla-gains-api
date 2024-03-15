import { Request } from 'express';

import { EditUserDto } from '../../models/types/user.types';

export type EditUserInfoRequest = Request<object, any, EditUserDto>;
