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
// no POST - users must hit /auth/signup endpoint to create new users
router.put('/:userId', [
    (0, express_validator_1.check)('firstName')
        .exists()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage('First name is a required string and must be between 1 and 30 characters'),
    (0, express_validator_1.check)('lastName')
        .exists()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage('Last name is a required string and must be between 1 and 30 characters'),
    (0, express_validator_1.check)('username')
        .exists()
        .isString()
        .isEmail()
        .withMessage('Username is required and must be an email address'),
    (0, express_validator_1.check)('password')
        .exists()
        .isString()
        .isStrongPassword()
        .withMessage('Password is a required string'),
    (0, express_validator_1.check)('passwordConfirm')
        .custom(utils_1.passwordValidator),
    utils_1.onValidated,
    userController_1.default.updateUser
]);
router.delete('/:userId', userController_1.default.deleteUser);
router.get('/:userId/posts', postController_1.default.getUserPosts);
exports.default = router;
