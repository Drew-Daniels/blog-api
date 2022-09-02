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
const commentModel_1 = require("../models/commentModel");
const mongodb_1 = require("mongodb");
const userModel_1 = require("../models/userModel");
function getPosts(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postsMinusComments = yield postModel_1.Post.find().lean();
            // TODO: Create an interface that
            const postsPlusComments = yield Promise.all(postsMinusComments.map(function supplyPostWithComments(post) {
                return __awaiter(this, void 0, void 0, function* () {
                    const comments = yield commentModel_1.Comment.find({ post: post._id }).lean();
                    return Object.assign(Object.assign({}, post), { comments: comments });
                });
            }));
            res.send({ posts: postsPlusComments });
        }
        catch (err) {
            next(err);
        }
    });
}
function getPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongodb_1.ObjectId.isValid(req.params['postId']))
            return res.sendStatus(400);
        try {
            const post = yield postModel_1.Post.findById(req.params['postId']);
            if (!post)
                return res.sendStatus(404);
            // TODO: hydrate w/ comments
            return res.status(200).json({ post });
        }
        catch (err) {
            next(err);
        }
    });
}
function getUserPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!mongodb_1.ObjectId.isValid(req.params['userId']))
            return res.sendStatus(400); // invalid BSON string
        const userExists = yield userModel_1.User.findById(userId);
        if (!userExists)
            return res.sendStatus(404);
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
        const { title, body } = req.body;
        try {
            const post = yield postModel_1.Post.create({
                author: req.user._id,
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
            res.send({ post });
        }
        catch (err) {
            next(err);
        }
    });
}
function deletePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.params;
        if (!mongodb_1.ObjectId.isValid(postId))
            return res.sendStatus(400);
        try {
            const postExists = !!(yield postModel_1.Post.findById(postId));
            if (!postExists)
                return res.sendStatus(404);
            yield postModel_1.Post.findByIdAndDelete(postId);
            console.log(`Post ${postId} has been deleted`);
            return res.sendStatus(200);
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
