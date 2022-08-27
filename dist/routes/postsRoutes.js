"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = __importDefault(require("../controllers/postController"));
const commentController_1 = __importDefault(require("../controllers/commentController"));
const router = (0, express_1.Router)();
router.get('/', postController_1.default.getPosts);
router.post('/', postController_1.default.createPost);
router.get('/:postId', postController_1.default.getPost);
router.put('/:postId', postController_1.default.updatePost);
router.delete('/:postId', postController_1.default.deletePost);
router.get('/:postId/comments', commentController_1.default.getComments);
router.post('/:postId/comments', commentController_1.default.createComment);
router.put('/:postId/comments/:commentId', commentController_1.default.updateComment);
router.delete('/:postId/comments/:commentId', commentController_1.default.deleteComment);
exports.default = router;
