"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var mongoDb = process.env['DB_DEV'];
mongoose_1.default.connect(mongoDb);
mongoose_1.default.connection.on('error', console.error.bind(console, 'MongoDb connection error: '));
