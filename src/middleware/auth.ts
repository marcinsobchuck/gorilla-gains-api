import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../models/user';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async function (jwt_payload, done) {
      try {
        const user = await User.findOne({ _id: jwt_payload._id });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
