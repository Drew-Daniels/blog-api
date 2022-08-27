import { Router } from "express";
import userController from '../controllers/userController';
import postController from "../controllers/postController";

const router = Router();

router.get('/', userController.getUsers);
router.put('/', userController.updateUser);
router.post('/', userController.createUser);

router.get('/:userId', userController.getUser);
router.delete('/:userId', userController.deleteUser);

router.get('/:userId/posts', postController.getUserPosts);

export default router;
