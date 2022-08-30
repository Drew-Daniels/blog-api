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
        // mongoose.connection.once('open', () => {
        //   console.log(`MongoDB successfully connected to ${mongoUri}`);
        // });
        // move this into a separate function
        bcryptjs_1.default.genSalt(10, function onSaltGenerated(err, salt) {
            if (err) {
                console.log(err);
            }
            const { firstName, lastName, username, password } = constants_1.SEED_USER_INFO;
            bcryptjs_1.default.hash(password, salt, function onHashGenerated(err, hash) {
                if (err) {
                    console.log(err);
                }
                // create new user
                const user = new userModel_1.User({
                    firstName,
                    lastName,
                    username,
                    hash,
                });
                user.save(function onUserSaved(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        });
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
