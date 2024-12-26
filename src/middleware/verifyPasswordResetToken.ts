import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../models/user';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true
    },
    async function (jwt_payload, done) {
      try {
        if (jwt_payload.exp < Date.now()) {
          return done(null, false, { message: 'Token expired' });
        }
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
      }
    }
  )
);
