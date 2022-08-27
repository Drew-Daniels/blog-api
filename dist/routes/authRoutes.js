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
        const token = jsonwebtoken_1.default.sign(user, process.env['SECRET'], tokenOpts);
        return res.status(200).json({ user, token });
    })(req, res);
});
router.delete('/', function handleLogout(req, res) {
    // verify token, logout user
    console.log(req);
    console.log(res);
});
exports.default = router;
