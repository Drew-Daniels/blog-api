import { Router } from "express";

import userController from '../controllers/userController';
import postController from "../controllers/postController";
import { onValidated } from "../utils/utils";
import { check } from "express-validator";

const router = Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUser);
router.put('/:userId', [
  check('firstName'),
  check('lastName'),
  check('username'),
  check('password'),
  check('passwordConfirm'),
  onValidated,
  userController.updateUser
]);
router.delete('/:userId', userController.deleteUser);

router.get('/:userId/posts', postController.getUserPosts);

export default router;
