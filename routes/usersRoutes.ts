import { Router, Request, Response } from "express";
import userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUser);

router.get('/:userId/posts', function getUserPosts(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:userId/posts/:postId', function getUserPost(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

export default router;
