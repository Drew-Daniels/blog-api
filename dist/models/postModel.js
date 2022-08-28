"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isPublished: { type: String, default: false, required: true },
}, { timestamps: true });
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.Post = Post;
