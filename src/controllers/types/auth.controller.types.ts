import { Request } from 'express';

export interface UserCredentials {
  email: string;
  password: string;
}

export type AuthenticateRequest = Request<object, any, UserCredentials>;
