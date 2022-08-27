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
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const postModel_1 = require("../models/postModel");
function getUsers(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = userModel_1.User.find().exec();
            res.status(200).json({ users });
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
                const user = userModel_1.User.findById(req.params["userId"]).exec();
                res.status(200).json({ user });
            }
            catch (err) {
                next(err);
            }
        }
        res.status(400).end();
    });
}
function getUserPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params['userId']) {
            try {
                const posts = postModel_1.Post.find({ userId: req.params["userId"] }).exec();
                res.status(200).json({ posts });
            }
            catch (err) {
                next(err);
            }
        }
        res.status(400).end();
    });
}
exports.default = {
    getUsers,
    getUser,
    getUserPosts,
};
