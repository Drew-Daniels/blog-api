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
const constants_1 = require("../constants");
var env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
const app = (0, express_1.default)();
var PORT = process.env['PORT'];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passportConfig_1.default.initialize());
app.use('/', authRoutes_1.default);
const server = app.listen(() => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.startupMongoServer)();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.shutdownMongoServer)();
    server.close();
}));
describe('POST "api/auth"', () => {
    describe('returns an error response when: ', () => {
        test('username provided does not match a registered user', done => {
            (0, supertest_1.default)(app)
                .post('/')
                // missing last character in username
                .send({ username: 'john@who.com', password: constants_1.SEED_USER_INFO.password })
                .expect(401, done);
        });
        test('password provided does not match a registered user', done => {
            (0, supertest_1.default)(app)
                .post('/')
                // missing last character in pwd
                .send({ username: constants_1.SEED_USER_INFO.username, password: '6JtxHvbnAh$@V9A' })
                .expect(401, done);
        });
    });
    describe('returns authenticated user w/ token when: ', () => {
        test('registered user provides correct credentials', done => {
            (0, supertest_1.default)(app)
                .post('/')
                .send({ username: constants_1.SEED_USER_INFO.username, password: constants_1.SEED_USER_INFO.password })
                .expect(200)
                .then(response => {
                expect(response.body).toEqual(expect.objectContaining({
                    user: expect.any(Object),
                    token: expect.any(String),
                }));
                done();
            });
        });
    });
});
describe('POST "api/auth/signup"', () => {
    const ENDPOINT = '/signup';
    describe('returns an error response when: ', () => {
        describe('firstName is: ', () => {
            test('undefined', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { firstName: undefined });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('not a string', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { firstName: 4 });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('empty string', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { firstName: '' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { firstName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar lectus ante, nec sollicitudin orci sagittis non. Nulla vehicula euismod finibus. Aliquam sed nibh justo. Proin blandit vestibulum arcu, nec fermentum.' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
        });
        describe('lastName is: ', () => {
            test('undefined', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { lastName: undefined });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('not a string', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { lastName: 4 });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('empty string', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { lastName: '' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { lastName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar lectus ante, nec sollicitudin orci sagittis non. Nulla vehicula euismod finibus. Aliquam sed nibh justo. Proin blandit vestibulum arcu, nec fermentum.' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
        });
        describe('username is: ', () => {
            test('undefined', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { username: undefined });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('not an email', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { username: 'notanemail' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { username: 'thisisanemailthatiswaylongerthan30charactersandshouldbeconsidredinvalid@gmail.com' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
            test('not available', done => {
                const body = Object.assign({}, constants_1.SEED_USER_INFO); // SEED_USER_INFO is used to seed db with a user prior to tests being run
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(409, done);
            });
        });
        describe('password is: ', () => {
            test('not a strong password', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { password: 'weak', passwordConfirm: 'weak' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
        });
        describe('passwordConfirm is: ', () => {
            test('different from password', done => {
                const body = Object.assign(Object.assign({}, constants_1.SEED_USER_INFO), { password: '#Hgs2@u8!F4gUQ%f', passwordConfirm: '#Hgs2@u8!F4gUQ%f+++' });
                (0, supertest_1.default)(app)
                    .post(ENDPOINT)
                    .send(body)
                    .expect(400, done);
            });
        });
    });
    describe('creates and returns new user when: ', () => {
        test('firstName, lastName, username, password, and passwordConfirm all meet criteria', done => {
            const body = Object.assign({}, constants_1.NEW_USER_INFO);
            (0, supertest_1.default)(app)
                .post(ENDPOINT)
                .send(body)
                .expect(200, done);
        });
    });
});
