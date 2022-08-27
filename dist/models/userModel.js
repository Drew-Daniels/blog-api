"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    hash: { type: String, required: true },
    isAuthor: { type: Boolean, required: true, default: false }
}, {
    timestamps: { createdAt: 'memberSince' }
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.User = User;
