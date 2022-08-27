"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const posts_1 = __importDefault(require("./routes/posts"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
app.use('/posts', posts_1.default);
app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
