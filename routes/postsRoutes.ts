import { Router } from "express";
import { check } from "express-validator";

import postController from '../controllers/postController';
import commentController from '../controllers/commentController';
import { onValidated } from "../utils/utils";

const router = Router();

router.get('/', postController.getPosts);
router.post('/', [
  check('author')
    .exists()
    .isString()
    .withMessage('Author is a required string'),
  check('title')
    .exists()
    .isString()
    .isLength({ min: 1, max: 100 }),
  check('body')
    .exists()
    .isString()
    .isLength({ min: 1, max: 300 }),
  onValidated,
  postController.createPost,
]);

router.get('/:postId', postController.getPost);
router.put('/:postId', [
  check('title')
    .exists()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Post title must be between 1 and 100 characters'),
  check('body')
    .exists()
    .isString()
    .isLength({ min: 1, max: 300 })
    .withMessage('Post body must be between 1 and 300 characters'),
  onValidated,
  postController.updatePost
]);
router.delete('/:postId', postController.deletePost);

router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', [
  check('body')
    .exists()
    .isString()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comments must be between 1 and 300 characters'),
  onValidated,
  commentController.createComment,
]);

router.put('/:postId/comments/:commentId', [
  check('body')
    .exists()
    .isString()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comments must be between 1 and 300 characters'),
  onValidated,
  commentController.updateComment
]);
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

export default router;
