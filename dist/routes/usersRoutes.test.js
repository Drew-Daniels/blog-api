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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const supertest_1 = __importDefault(require("supertest"));
var env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
const app = (0, express_1.default)();
var PORT = process.env['PORT'];
const mongoConfigTesting_1 = require("../mongoConfigTesting");
const passportConfig_1 = __importDefault(require("../passportConfig"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const usersRoutes_1 = __importDefault(require("./usersRoutes"));
const constants_1 = require("../constants");
const creds = { username: constants_1.SEED_USER_INFO.username, password: constants_1.SEED_USER_INFO.password };
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passportConfig_1.default.initialize());
app.use('/auth', authRoutes_1.default);
app.use('/users', passportConfig_1.default.authenticate('jwt', { session: false }), usersRoutes_1.default);
const server = app.listen(() => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
var token;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.startupMongoServer)();
    const response = yield (0, supertest_1.default)(app)
        .post('/auth')
        .send(creds);
    console.log(response);
    token = response.body.token;
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.shutdownMongoServer)();
    server.close();
}));
describe('GET /api/users', () => {
    const ENDPOINT = '/users';
    test('returns an error response when request is unauthenticated', done => {
        (0, supertest_1.default)(app)
            .get(ENDPOINT)
            .expect(401, done);
    });
    test('returns all users when request is authenticated', done => {
        (0, supertest_1.default)(app)
            .get(ENDPOINT)
            .auth(token, { type: 'bearer' })
            .expect(401, done);
    });
});
describe('GET /api/users/:userId', () => {
    describe('returns an error response when: ', () => {
        test.todo('request is unauthenticated');
        test.todo('request is authenticated but userId does not belong to a user in the db');
    });
    describe('returns user when: ', () => {
        test.todo('request is authenticated and userId belongs to a user in the db');
    });
});
describe('PUT /api/users/:userId', () => {
    describe('returns an error response when: ', () => {
        test.todo('request is unauthenticated');
        test.todo('userId does not belong to a user in the db');
        describe('firstName is: ', () => {
            test.todo('undefined');
            test.todo('not a string');
            test.todo('empty string');
            test.todo('greater than 30 characters');
        });
        describe('lastName is: ', () => {
            test.todo('undefined');
            test.todo('not a string');
            test.todo('empty string');
            test.todo('greater than 30 characters');
        });
        describe('username is: ', () => {
            test.todo('undefined');
            test.todo('not an email');
            test.todo('greater than 30 characters');
            test.todo('not available');
        });
        describe('password is: ', () => {
            test.todo('not a strong password');
        });
        describe('passwordConfirm is: ', () => {
            test.todo('different from password');
        });
    });
    describe('returns an updated user when: ', () => {
        describe('firstName is: ', () => {
            test.todo('a 1 character string');
            test.todo('a string between 1 and 30 characters');
            test.todo('a 30 character string');
        });
        describe('lastName is: ', () => {
            test.todo('1 character string');
            test.todo('string between 1 and 30 characters');
            test.todo('30 character string');
        });
        describe('username is: ', () => {
            test.todo('an email');
            test.todo('available');
        });
        describe('password is: ', () => {
            test.todo('strong password');
        });
        describe('passwordConfirm is: ', () => {
            test.todo('same as password');
        });
    });
});
describe('DELETE /api/users/:userId', () => {
});
describe('GET /api/users/:userId/posts', () => {
});
