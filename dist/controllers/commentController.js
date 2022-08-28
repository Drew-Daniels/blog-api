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
const commentModel_1 = require("../models/commentModel");
function getComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.params;
        try {
            const comments = yield commentModel_1.Comment.find({ postId });
            res.send({ comments });
        }
        catch (err) {
            next(err);
        }
    });
}
function createComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.params;
        const { body } = req.body;
        try {
            const comment = yield commentModel_1.Comment.create({
                post: postId,
                body,
            });
            console.log(`Comment added: ${comment}`);
            res.send({ comment });
        }
        catch (err) {
            next(err);
        }
    });
}
function updateComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        const { body } = req.body;
        try {
            const comment = yield commentModel_1.Comment.findByIdAndUpdate(commentId, { body }, { returnDocument: 'after' });
            console.log(`Comment ${commentId} has been updated: ${comment}`);
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        try {
            yield commentModel_1.Comment.findByIdAndDelete(commentId);
            console.log(`Comment ${commentId} deleted`);
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
const commentController = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};
exports.default = commentController;
