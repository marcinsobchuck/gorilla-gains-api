import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../models/user';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    function (jwt_payload, done) {
      const user = User.findOne({ id: jwt_payload._id });
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    }
  )
);
