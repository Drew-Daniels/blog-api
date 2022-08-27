import dotenv from "dotenv";
import expander from 'dotenv-expand';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import passport from "passport";

var env = dotenv.config();
expander.expand(env);

import { IUser } from "../models/userModel";
const router = Router();

// logs a user in - returning a token that can be used to authenticate protected routes
router.post('/', function handleLogin(req, res, next) {
  passport.authenticate('local', { session: false }, function onAuthenticationChecked(err: Error, user: IUser) {
    if (err) { return next(err) }
    if (!user) { return res.status(401).end() }
    req.login(user, { session: false }, function onUserLoggedIn(err) {
      if (err) {
        res.send(err);
      }
    });
    // generate signed token
    const MINUTE = 60;
    const tokenOpts = { expiresIn: 5 * MINUTE };
    const token = jwt.sign(user, process.env['SECRET'] as string, tokenOpts);
    return res.status(200).json({ user, token });
  })(req, res);
});

router.delete('/', function handleLogout(req, res): void {
   // verify token, logout user
  console.log(req);
  console.log(res);
});

export default router;
