"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
    body: String,
}, { timestamps: true });
const Comment = (0, mongoose_1.model)('Comment', CommentSchema);
exports.Comment = Comment;
