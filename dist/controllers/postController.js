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
exports.getPost = exports.getPosts = void 0;
const postModel_1 = require("../models/postModel");
function getPosts(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = postModel_1.Post.find().exec();
            res.status(200).json({ posts });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getPosts = getPosts;
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
exports.getPost = getPost;
