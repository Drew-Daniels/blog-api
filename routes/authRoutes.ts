import dotenv from "dotenv";
import expander from 'dotenv-expand';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import passport from "passport";

var env = dotenv.config();
expander.expand(env);

import { IUser } from "../models/userModel";
import { check } from "express-validator";
import { onValidated, passwordValidator } from "../utils/utils";
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
// '/signup' has to be under an unprotected route ('/auth/signup' vs. '/users' bc 'users' is a route that req. auth)
router.post('/signup', [
  check('firstName')
    .exists()
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('First name is a required string'),
  check('lastName')
    .exists()
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('Last name is a required string'),
  check('username')
    .exists()
    .isString()
    .isEmail()
    .withMessage('Username is required and must be an email address'),
  check('password')
    .exists()
    .isString()
    .isStrongPassword()
    .withMessage('Password is a required string'),
  check('passwordConfirm')
    .custom(passwordValidator),
  onValidated,
  userController.createUser,
]);

export default router;
