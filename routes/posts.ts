import { Router, Request, Response } from "express";

const router = Router();

router.get('/', function getPosts(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:postId', function getPost(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:postId/comments', function getPostComments(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

router.get('/:postId/comments/:commentId', function getPostComment(req: Request, res: Response): void {
    console.log(req);
    console.log(res);
});

export default router;
