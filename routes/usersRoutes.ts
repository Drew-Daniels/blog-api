import { Router } from "express";

import userController from '../controllers/userController';
import postController from "../controllers/postController";

const router = Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

router.get('/:userId/posts', postController.getUserPosts);

export default router;
