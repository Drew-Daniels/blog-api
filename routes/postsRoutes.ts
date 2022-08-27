import { Router } from "express";
import postController from '../controllers/postController';
import commentController from '../controllers/commentController';

const router = Router();

router.get('/', postController.getPosts);
router.post('/', postController.createPost);

router.get('/:postId', postController.getPost);

router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);

router.put('/:postId/comments/:commentId', commentController.updateComment);
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

export default router;
