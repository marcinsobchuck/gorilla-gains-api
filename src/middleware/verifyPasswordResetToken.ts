import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../models/user';

passport.use(
  'verifyPasswordResetToken',
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async function (jwt_payload, done) {
      try {
        const user = await User.findOne({ _id: jwt_payload._id });
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        if (user.passwordChangedAt && jwt_payload.iat * 1000 < user.passwordChangedAt.getTime()) {
          return done(null, false, { message: 'Token no longer valid due to password change.' });
        }

        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    }
  )
);

export const verifyPasswordResetToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'verifyPasswordResetToken',
    { session: false },
    (err: any, user: Express.User | false | null, info: { message: string; name?: string }) => {
      if (info && info.name === 'TokenExpiredError') {
        return res.status(401).json('Token expired');
      }

      if (err) return next(err);
      if (!user) {
        return res.status(401).json(info?.message || 'Unauthorized');
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
