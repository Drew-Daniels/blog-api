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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownMongoServer = exports.startupMongoServer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("./models/userModel");
const postModel_1 = require("./models/postModel");
const commentModel_1 = require("./models/commentModel");
const constants_1 = require("./constants");
var mongoServer;
function startupMongoServer() {
    return __awaiter(this, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        yield mongoose_1.default.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose_1.default.connection.on('error', e => {
            if (e.message.code === 'ETIMEDOUT') {
                console.log(e);
                mongoose_1.default.connect(mongoUri);
            }
            console.log(e);
        });
        const { firstName, lastName, username, password } = constants_1.SEED_USER_INFO;
        try {
            // seed one user
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hash = yield bcryptjs_1.default.hash(password, salt);
            const user = new userModel_1.User({
                firstName,
                lastName,
                username,
                hash,
            });
            yield user.save();
            // seed one post by seeded user
            const post = new postModel_1.Post({
                author: user,
                title: 'First post title!',
                body: 'First post body!',
            });
            yield post.save();
            // seed one comment by seeded user
            const comment = new commentModel_1.Comment({
                author: user,
                post: post,
                body: 'First comment body!'
            });
            yield comment.save();
            return { seedUserId: user.id, seedPostId: post.id, seedCommentId: comment.id };
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.startupMongoServer = startupMongoServer;
function shutdownMongoServer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoServer) {
            const collections = yield mongoose_1.default.connection.db.collections();
            for (let collection of collections) {
                yield collection.drop();
            }
            yield mongoose_1.default.connection.close();
            yield mongoServer.stop();
        }
    });
}
exports.shutdownMongoServer = shutdownMongoServer;
