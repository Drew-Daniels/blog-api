"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const postController_1 = __importDefault(require("../controllers/postController"));
const utils_1 = require("../utils/utils");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', userController_1.default.getUsers);
router.get('/:userId', userController_1.default.getUser);
router.put('/:userId', [
    (0, express_validator_1.check)('firstName'),
    (0, express_validator_1.check)('lastName'),
    (0, express_validator_1.check)('username'),
    (0, express_validator_1.check)('password'),
    (0, express_validator_1.check)('passwordConfirm'),
    utils_1.onValidated,
    userController_1.default.updateUser
]);
router.delete('/:userId', userController_1.default.deleteUser);
router.get('/:userId/posts', postController_1.default.getUserPosts);
exports.default = router;
