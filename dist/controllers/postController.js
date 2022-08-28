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
            const posts = yield postModel_1.Post.find();
            // TODO: hydrate w/ comments
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
                const post = yield postModel_1.Post.findById(req.params['postId']);
                // TODO: hydrate w/ comments
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
        const { userId } = req.params;
        try {
            const posts = yield postModel_1.Post.find({ author: userId });
            res.send({ posts });
        }
        catch (err) {
            next(err);
        }
    });
}
function createPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, body, author } = req.body;
        try {
            const post = yield postModel_1.Post.create({
                author,
                title,
                body,
            });
            post.save(function onPostSaved(err) {
                if (err) {
                    return next(err);
                }
                console.log('New Post saved: ', post);
                res.send({ post });
            });
        }
        catch (err) {
            return next(err);
        }
    });
}
function updatePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.params;
        const { title, body } = req.body;
        try {
            const post = yield postModel_1.Post.findByIdAndUpdate(postId, { title, body }, { returnDocument: 'after' });
            console.log(`Post ${postId} has been updated: ${post}`);
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
function deletePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.params;
        try {
            yield postModel_1.Post.findByIdAndDelete(postId);
            console.log(`Post ${postId} has been deleted`);
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
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
