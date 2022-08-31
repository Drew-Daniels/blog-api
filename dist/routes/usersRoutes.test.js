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
var userId;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    userId = yield (0, mongoConfigTesting_1.startupMongoServer)();
    const response = yield (0, supertest_1.default)(app)
        .post('/auth')
        .send(creds);
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
            .expect(200, done);
    });
});
describe('GET /api/users/:userId', () => {
    describe('returns an error response when: ', () => {
        test('request is unauthenticated', done => {
            (0, supertest_1.default)(app)
                .get('/users/' + userId)
                .expect(401, done);
        });
        test('request is authenticated but userId provided cannot be parsed as BSON id', done => {
            (0, supertest_1.default)(app)
                .get('/users/' + '630eaf711a7937a1a037d1cg') // only characters 0-9 and a-f
                .auth(token, { type: 'bearer' })
                .expect(400, done);
        });
        test('request is authenticated but userId does not belong to a user in the db', done => {
            (0, supertest_1.default)(app)
                .get('/users/' + '630eaf711a7937a1a037d1cd')
                .auth(token, { type: 'bearer' })
                .expect(404, done);
        });
    });
    describe('returns user when: ', () => {
        test('request is authenticated and userId belongs to a user in the db', done => {
            (0, supertest_1.default)(app)
                .get('/users/' + userId)
                .auth(token, { type: 'bearer' })
                .expect(200, done);
        });
    });
});
describe('PUT /api/users/:userId', () => {
    describe('returns an error response when: ', () => {
        test('request is unauthenticated', done => {
            (0, supertest_1.default)(app)
                .put('/users/' + userId)
                .send(constants_1.UPDATED_USER_INFO)
                .expect(401, done);
        });
        test('request is authenticated but userId provided cannot be parsed as BSON id', done => {
            (0, supertest_1.default)(app)
                .put('/users/' + '630eaf711a7937a1a037d1cg')
                .auth(token, { type: 'bearer' })
                .send(constants_1.UPDATED_USER_INFO)
                .expect(400, done);
        });
        test('request is authenticated, userId is valid ObjectId, but userId does not belong to a user in the db', done => {
            (0, supertest_1.default)(app)
                .put('/users/' + '630eaf711a7937a1a037d1cd')
                .auth(token, { type: 'bearer' })
                .send(constants_1.UPDATED_USER_INFO)
                .expect(404, done);
        });
        describe('firstName is: ', () => {
            test('empty string', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { firstName: '' }))
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { firstName: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' }))
                    .expect(400, done);
            });
        });
        describe('lastName is: ', () => {
            test('empty string', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { lastName: '' }))
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { lastName: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' }))
                    .expect(400, done);
            });
        });
        describe('username is: ', () => {
            test('not an email', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { username: 'notanemail' }))
                    .expect(400, done);
            });
            test('greater than 30 characters', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { username: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' }))
                    .expect(400, done);
            });
            test('not available', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { username: constants_1.SEED_USER_INFO.username }))
                    .expect(409, done);
            });
        });
        describe('password is: ', () => {
            test('not a strong password', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { password: 'weak' }))
                    .expect(400, done);
            });
        });
        describe('passwordConfirm is: ', () => {
            test('different from password', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_USER_INFO), { password: constants_1.UPDATED_USER_INFO.password.slice(-1) }))
                    .expect(400, done);
            });
        });
    });
    describe('returns an updated user when: ', () => {
        describe('firstName is: ', () => {
            test('firstName and lastName are between 1 and 30 characters, username is an available email, password is strong, and password confirm matches password', done => {
                (0, supertest_1.default)(app)
                    .put('/users/' + userId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign({}, constants_1.UPDATED_USER_INFO))
                    .expect(200, done);
            });
        });
    });
});
describe('DELETE /api/users/:userId', () => {
    describe('returns an error response when: ', () => {
        test('request is not authenticated', done => {
            (0, supertest_1.default)(app)
                .delete('/users/' + userId)
                .expect(401, done);
        });
        test('request is authenticated, but userId is not a valid ObjectId', done => {
            (0, supertest_1.default)(app)
                .delete('/users/' + '630eaf711a7937a1a037d1cg')
                .auth(token, { type: 'bearer' })
                .expect(400, done);
        });
        test('request is authenticated, and userId is valid ObjectId, but does not match document in db', done => {
            (0, supertest_1.default)(app)
                .delete('/users/' + '630eaf711a7937a1a037d1cd')
                .auth(token, { type: 'bearer' })
                .expect(404, done);
        });
    });
    test('deletes a user with an id matching userId when userId is a valid ObjectId and matches a document in db', done => {
        (0, supertest_1.default)(app)
            .delete('/users/' + userId)
            .auth(token, { type: 'bearer' })
            .expect(200, done);
    });
});
describe('GET /api/users/:userId/posts', () => {
    describe('returns an error response when: ', () => {
    });
    describe('returns an array of a given user\'s posts when userId is valid ObjectId and matches a document in db', () => {
    });
});
