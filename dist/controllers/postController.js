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
const postModel_1 = require("../models/postModel");
function getPosts(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield postModel_1.Post.find().exec();
            // hydrate each post with comments
            res.status(200).json({ posts });
        }
        catch (err) {
            next(err);
        }
    });
}
function getPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params['postId']) {
            try {
                const post = postModel_1.Post.findById(req.params['postId']).exec();
                res.status(200).json({ post });
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
    });
}
function createPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate authenticated
        // save in db
        // send response code and return new post
    });
}
function updatePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate authenticated
        // save in db
        // send response code and return post
    });
}
function deletePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate authenticated
        // save in db
        // send response code and return post
    });
}
const postController = {
    getPosts,
    getPost,
    getUserPosts,
    createPost,
    updatePost,
    deletePost,
};
exports.default = postController;
