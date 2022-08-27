"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', function getPosts(req, res) {
    console.log(req);
    console.log(res);
});
router.get('/:postId', function getPost(req, res) {
    console.log(req);
    console.log(res);
});
router.get('/:postId/comments', function getPostComments(req, res) {
    console.log(req);
    console.log(res);
});
router.get('/:postId/comments/:commentId', function getPostComment(req, res) {
    console.log(req);
    console.log(res);
});
exports.default = router;
