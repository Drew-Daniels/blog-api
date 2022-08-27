import { Router, Request, Response } from "express";

const router = Router();

router.get('/', function getUsers(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:userId', function getUser(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:userId/posts', function getUserPosts(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:userId/posts/:postId', function getUserPost(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

export default router;
