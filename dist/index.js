"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const morgan_1 = __importDefault(require("morgan"));
var env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
var app = (0, express_1.default)();
var PORT = process.env['PORT'];
require("./mongoConfig");
const passportConfig_1 = __importDefault(require("./passportConfig"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const postsRoutes_1 = __importDefault(require("./routes/postsRoutes"));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passportConfig_1.default.initialize());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', passportConfig_1.default.authenticate('jwt', { session: false }), usersRoutes_1.default);
app.use('/api/posts', passportConfig_1.default.authenticate('jwt', { session: false }), postsRoutes_1.default);
app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
