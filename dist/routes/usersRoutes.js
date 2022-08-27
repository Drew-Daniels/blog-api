"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.get('/', userController_1.default.getUsers);
router.get('/:userId', userController_1.default.getUser);
router.get('/:userId/posts', function getUserPosts(req, res) {
    console.log(req);
    console.log(res);
});
router.get('/:userId/posts/:postId', function getUserPost(req, res) {
    console.log(req);
    console.log(res);
});
exports.default = router;
