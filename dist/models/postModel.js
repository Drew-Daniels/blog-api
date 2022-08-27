"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    body: String,
    isPublished: Boolean,
}, { timestamps: true });
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.Post = Post;
