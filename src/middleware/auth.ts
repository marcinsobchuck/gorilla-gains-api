import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserAuthRequest extends Request {
  user: string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('X-auth-token');

  if (!token) return res.status(401).send('Acces denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as UserAuthRequest).user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};
