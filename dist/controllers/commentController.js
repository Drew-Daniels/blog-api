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
        try {
            return commentModel_1.Comment.find({ postId }).exec();
        }
        catch (err) {
            next(err);
        }
    });
}
function createComment() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function updateComment() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function deleteComment() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
const commentController = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};
exports.default = commentController;
