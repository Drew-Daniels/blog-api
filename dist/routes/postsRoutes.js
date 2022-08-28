"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const postController_1 = __importDefault(require("../controllers/postController"));
const commentController_1 = __importDefault(require("../controllers/commentController"));
const utils_1 = require("../utils/utils");
const router = (0, express_1.Router)();
router.get('/', postController_1.default.getPosts);
router.post('/', [
    (0, express_validator_1.check)('author')
        .exists()
        .isString()
        .withMessage('Author is a required string'),
    (0, express_validator_1.check)('title')
        .exists()
        .isString()
        .isLength({ min: 1, max: 100 }),
    (0, express_validator_1.check)('body')
        .exists()
        .isString()
        .isLength({ min: 1, max: 300 }),
    utils_1.onValidated,
    postController_1.default.createPost,
]);
router.get('/:postId', postController_1.default.getPost);
router.put('/:postId', [
    (0, express_validator_1.check)('title')
        .exists()
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('Post title must be between 1 and 100 characters'),
    (0, express_validator_1.check)('body')
        .exists()
        .isString()
        .isLength({ min: 1, max: 300 })
        .withMessage('Post body must be between 1 and 300 characters'),
    utils_1.onValidated,
    postController_1.default.updatePost
]);
router.delete('/:postId', postController_1.default.deletePost);
router.get('/:postId/comments', commentController_1.default.getComments);
router.post('/:postId/comments', [
    (0, express_validator_1.check)('body')
        .exists()
        .isString()
        .isLength({ min: 1, max: 300 })
        .withMessage('Comments must be between 1 and 300 characters'),
    utils_1.onValidated,
    commentController_1.default.createComment,
]);
router.put('/:postId/comments/:commentId', [
    (0, express_validator_1.check)('body')
        .exists()
        .isString()
        .isLength({ min: 1, max: 300 })
        .withMessage('Comments must be between 1 and 300 characters'),
    utils_1.onValidated,
    commentController_1.default.updateComment
]);
router.delete('/:postId/comments/:commentId', commentController_1.default.deleteComment);
exports.default = router;
