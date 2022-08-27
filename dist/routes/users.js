"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', function getUsers(req, res) {
  console.log(req);
  console.log(res);
});
router.get('/:userId', function getUser(req, res) {
  console.log(req);
  console.log(res);
});
router.get('/:userId/posts', function getUserPosts(req, res) {
  console.log(req);
  console.log(res);
});
router.get('/:userId/posts/:postId', function getUserPost(req, res) {
  console.log(req);
  console.log(res);
});
exports.default = router;
