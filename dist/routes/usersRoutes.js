"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const postController_1 = __importDefault(require("../controllers/postController"));
const router = (0, express_1.Router)();
router.get('/', userController_1.default.getUsers);
router.put('/', userController_1.default.updateUser);
router.get('/:userId', userController_1.default.getUser);
router.delete('/:userId', userController_1.default.deleteUser);
router.get('/:userId/posts', postController_1.default.getUserPosts);
exports.default = router;
