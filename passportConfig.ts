import dotenv from "dotenv";
import expander from 'dotenv-expand';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs';
import passportJwt from 'passport-jwt';

var env = dotenv.config();
expander.expand(env);

import { IUser, User } from "./models/userModel";

var JwtStrategy = passportJwt.Strategy;
var ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy(function verify(username, password, cb) {
  User.findOne({ username }, function onUserSearched(err: Error, user: IUser): void {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false) }
    bcrypt.compare(password, user.hash, function onHashesCompared(err, result) {
      if (err) { return cb(err) }
      if (!result) { return cb(null, false) }
      return cb(null, user);
    });
  });
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env['SECRET'] as string,
}, function verify(jwtPayload, cb) {
  return User.findById(jwtPayload._id)
    .then(user => {
      if (!user) { return cb(null, false) }
      return cb(null, user);
    })
    .catch(err => {
      return cb(err);
    });
}));

export default passport;
