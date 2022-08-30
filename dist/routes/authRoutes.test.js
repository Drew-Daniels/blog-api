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
const mongoConfigTesting_1 = require("../mongoConfigTesting");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const passportConfig_1 = __importDefault(require("../passportConfig"));
var env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
const app = (0, express_1.default)();
var PORT = process.env['PORT'];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passportConfig_1.default.initialize());
app.use('/', authRoutes_1.default);
app.listen(() => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.startupMongoServer)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.shutdownMongoServer)();
}));
describe('POST "api/auth"', () => {
    describe('returns an error response when: ', () => {
        test('username provided does not match a registered user', done => {
            (0, supertest_1.default)(app)
                .post('/')
                // missing last character in username
                .send({ username: 'bob@dobbs.com', password: '6JtxHvbnAh$@V9AM' })
                .expect(401, done);
        });
        test('password provided does not match a registered user', done => {
            (0, supertest_1.default)(app)
                .post('/')
                // missing last character in pwd
                .send({ username: 'bob@dobbs.comz', password: '6JtxHvbnAh$@V9A' })
                .expect(401, done);
        });
    });
    describe('returns authenticated user w/ token when: ', () => {
        test('registered user provides correct credentials', done => {
            (0, supertest_1.default)(app)
                .post('/')
                .send({ username: 'bob@dobbs.comz', password: '6JtxHvbnAh$@V9AM' })
                .expect(200, done);
        });
    });
});
describe('POST "api/auth/signup"', () => {
    describe('returns an error response when: ', () => {
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
    describe('creates and returns new user when: ', () => {
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
