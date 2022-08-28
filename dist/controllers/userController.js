"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const postModel_1 = require("../models/postModel");
function getUsers(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userModel_1.User.find();
            res.send({ users });
        }
        catch (err) {
            next(err);
        }
    });
}
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params["userId"]) {
            try {
                const user = yield userModel_1.User.findById(req.params["userId"]);
                res.send({ user });
            }
            catch (err) {
                next(err);
            }
        }
        else {
            res.sendStatus(400);
        }
    });
}
function getUserPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params['userId']) {
            try {
                const posts = yield postModel_1.Post.find({ userId: req.params["userId"] });
                res.send({ posts });
            }
            catch (err) {
                next(err);
            }
        }
        else {
            res.sendStatus(400);
        }
    });
}
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, username, password } = req.body;
        const userExists = !!(yield userModel_1.User.count({ username }));
        if (userExists) {
            res.status(409).send({ error: 'A user with that username already exists' });
        }
        // hash pwd
        bcryptjs_1.default.genSalt(10, function onSaltGenerated(err, salt) {
            if (err) {
                next(err);
            }
            bcryptjs_1.default.hash(password, salt, function onHashGenerated(err, hash) {
                if (err) {
                    next(err);
                }
                // create new user
                const user = new userModel_1.User({
                    firstName,
                    lastName,
                    username,
                    hash,
                });
                user.save(function onUserSaved(err) {
                    if (err) {
                        return next(err);
                    }
                    res.send({ user });
                });
            });
        });
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { firstName, lastName, username, password } = req.body;
        bcryptjs_1.default.genSalt(10, function onSaltGenerated(err, salt) {
            if (err) {
                next(err);
            }
            bcryptjs_1.default.hash(password, salt, function onHashGenerated(err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        next(err);
                    }
                    try {
                        const user = yield userModel_1.User.findByIdAndUpdate(userId, {
                            firstName,
                            lastName,
                            username,
                            hash,
                        });
                        console.log(`User ${userId} has been updated: ${username} - ${lastName}, ${firstName}`);
                        res.send({ user });
                    }
                    catch (err) {
                        next(err);
                    }
                });
            });
        });
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            yield userModel_1.User.findByIdAndDelete(userId);
            console.log(`User ${userId} has been deleted`);
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
const userController = {
    getUsers,
    getUser,
    getUserPosts,
    createUser,
    updateUser,
    deleteUser,
};
exports.default = userController;
