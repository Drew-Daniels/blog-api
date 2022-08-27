import dotenv from "dotenv";
import expander from 'dotenv-expand';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import passport from "passport";

var env = dotenv.config();
expander.expand(env);

import { IUser } from "../models/userModel";
import {check} from "express-validator";
import {onValidated} from "../utils/utils";
import userController from "../controllers/userController";
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
    const token = jwt.sign(user.toJSON(), process.env['SECRET'] as string, tokenOpts);
    return res.send({ user, token });
  })(req, res);
});

router.post('/signup', [
  check('firstName')
    .isString()
    .withMessage('First name is a required string'),
  check('lastName')
    .isString()
    .withMessage('Last name is a required string'),
  check('username')
    .isString()
    .isEmail()
    .withMessage('Username is required and must be an email address'),
  check('password')
    .isString()
    .isStrongPassword()
    .withMessage('Password is a required string'),
  check('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  onValidated,
  userController.createUser
]);

router.delete('/', function handleLogout(req, res): void {
   // verify token, logout user
  console.log(req);
  console.log(res);
  res.sendStatus(200);
});

export default router;
