"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
var env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils/utils");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
// logs a user in - returning a token that can be used to authenticate protected routes
router.post('/', function handleLogin(req, res, next) {
    passport_1.default.authenticate('local', { session: false }, function onAuthenticationChecked(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).end();
        }
        req.login(user, { session: false }, function onUserLoggedIn(err) {
            if (err) {
                res.send(err);
            }
        });
        // generate signed token
        const MINUTE = 60;
        const tokenOpts = { expiresIn: 5 * MINUTE };
        const token = jsonwebtoken_1.default.sign(user.toJSON(), process.env['SECRET'], tokenOpts);
        return res.send({ user, token });
    })(req, res);
});
router.post('/signup', [
    (0, express_validator_1.check)('firstName')
        .exists()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage('First name is a required string'),
    (0, express_validator_1.check)('lastName')
        .exists()
        .isString()
        .isLength({ min: 1, max: 30 })
        .withMessage('Last name is a required string'),
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
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    utils_1.onValidated,
    userController_1.default.createUser,
]);
router.delete('/', function handleLogout(req, res) {
    // verify token, logout user
    console.log(req);
    console.log(res);
    res.sendStatus(200);
});
exports.default = router;
