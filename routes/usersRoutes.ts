import { Router } from "express";

import userController from '../controllers/userController';
import postController from "../controllers/postController";
import {onValidated, passwordValidator} from "../utils/utils";
import { check } from "express-validator";

const router = Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUser);
// no POST - users must hit /auth/signup endpoint to create new users
router.put('/:userId', [
  check('firstName')
    .exists()
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('First name is a required string and must be between 1 and 30 characters'),
  check('lastName')
    .exists()
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('Last name is a required string and must be between 1 and 30 characters'),
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
  userController.updateUser
]);
router.delete('/:userId', userController.deleteUser);

router.get('/:userId/posts', postController.getUserPosts);

export default router;
