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
const postsRoutes_1 = __importDefault(require("./postsRoutes"));
const constants_1 = require("../constants");
const creds = { username: constants_1.SEED_USER_INFO.username, password: constants_1.SEED_USER_INFO.password };
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passportConfig_1.default.initialize());
app.use('/auth', authRoutes_1.default);
app.use('/posts', passportConfig_1.default.authenticate('jwt', { session: false }), postsRoutes_1.default);
const server = app.listen(() => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
var token;
var userId;
var postId;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const seedInfo = yield (0, mongoConfigTesting_1.startupMongoServer)();
    userId = seedInfo.seedUserId;
    postId = seedInfo.seedPostId;
    const response = yield (0, supertest_1.default)(app)
        .post('/auth')
        .send(creds);
    token = response.body.token;
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.shutdownMongoServer)();
    server.close();
}));
describe('GET "api/posts"', () => {
    test('returns an error response when request is unauthenticated', done => {
        (0, supertest_1.default)(app)
            .get('/posts')
            .expect(401, done);
    });
    test('returns all posts when request is authenticated', done => {
        (0, supertest_1.default)(app)
            .get('/posts')
            .auth(token, { type: 'bearer' })
            .expect(200, done);
    });
});
describe('POST "api/posts"', () => {
    describe('returns an error response when: ', () => {
        test('request is unauthenticated', done => {
            (0, supertest_1.default)(app)
                .post('/posts')
                .send(constants_1.NEW_POST_INFO)
                .expect(401, done);
        });
        describe('request is authenticated, but title is: ', () => {
            test('a blank string', done => {
                (0, supertest_1.default)(app)
                    .post('/posts')
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.NEW_POST_INFO), { title: '' }))
                    .expect(400, done);
            });
            test('greater than 100 characters', done => {
                (0, supertest_1.default)(app)
                    .post('/posts')
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.NEW_POST_INFO), { title: 'y08vKU0RkDQSuOxE1UIeViK695gdpptYadXOTP1zHR65kvMreADA8Kv00F7Axrs80t7Pvajhrtauq5e26c6aYmy6WqMgkHc5Za01j' }))
                    .expect(400, done);
            });
        });
        describe('request is authenticated, but body is: ', () => {
            test('a blank string', done => {
                (0, supertest_1.default)(app)
                    .post('/posts')
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.NEW_POST_INFO), { body: '' }))
                    .expect(400, done);
            });
            test('greater than 300 characters', done => {
                (0, supertest_1.default)(app)
                    .post('/posts')
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.NEW_POST_INFO), { body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj' }))
                    .expect(400, done);
            });
        });
    });
    describe('returns a success response when: ', () => {
        test('creates and returns a new post when request is authenticated, and title and body meet requirements', done => {
            (0, supertest_1.default)(app)
                .post('/posts')
                .auth(token, { type: 'bearer' })
                .send(constants_1.NEW_POST_INFO)
                .expect(200, done);
        });
    });
});
describe('GET "api/posts/:postId"', () => {
    describe('returns an error response when: ', () => {
        test('request is unauthenticated', done => {
            (0, supertest_1.default)(app)
                .get('/posts/' + postId)
                .expect(401, done);
        });
        test('request is authenticated but postId is not a valid ObjectId', done => {
            (0, supertest_1.default)(app)
                .get('/posts/' + '6310aede9f3ebc201714e0eg')
                .auth(token, { type: 'bearer' })
                .expect(400, done);
        });
        test('request is authenticated but postId does not belong to a post in the db', done => {
            (0, supertest_1.default)(app)
                .get('/posts/' + '6310aede9f3ebc201714e0e9')
                .auth(token, { type: 'bearer' })
                .expect(404, done);
        });
    });
    describe('returns a post when: ', () => {
        test('request is authenticated and postId belongs to a post in the db', done => {
            (0, supertest_1.default)(app)
                .get('/posts/' + postId)
                .auth(token, { type: 'bearer' })
                .expect(200, done);
        });
    });
});
describe('PUT "api/posts/:postId"', () => {
    describe('returns an error response when: ', () => {
        describe('request is: ', () => {
            test('unauthenticated', done => {
                (0, supertest_1.default)(app)
                    .put('/posts/' + postId)
                    .send(constants_1.UPDATED_POST_INFO)
                    .expect(401, done);
            });
        });
        describe('title is: ', () => {
            test('a blank string', done => {
                (0, supertest_1.default)(app)
                    .put('/posts/' + postId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_POST_INFO), { title: '' }))
                    .expect(400, done);
            });
            test('greater than 100 characters', done => {
                (0, supertest_1.default)(app)
                    .put('/posts/' + postId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_POST_INFO), { title: 'y08vKU0RkDQSuOxE1UIeViK695gdpptYadXOTP1zHR65kvMreADA8Kv00F7Axrs80t7Pvajhrtauq5e26c6aYmy6WqMgkHc5Za01j' }))
                    .expect(400, done);
            });
        });
        describe('body is: ', () => {
            test('a blank string', done => {
                (0, supertest_1.default)(app)
                    .put('/posts/' + postId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_POST_INFO), { body: '' }))
                    .expect(400, done);
            });
            test('greater than 300 characters', done => {
                (0, supertest_1.default)(app)
                    .put('/posts/' + postId)
                    .auth(token, { type: 'bearer' })
                    .send(Object.assign(Object.assign({}, constants_1.UPDATED_POST_INFO), { body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj' }))
                    .expect(400, done);
            });
        });
    });
    describe('returns an updated post when: ', () => {
        test('request is authenticated, and title and body meet requirements', done => {
            (0, supertest_1.default)(app)
                .put('/posts/' + postId)
                .auth(token, { type: 'bearer' })
                .send(constants_1.UPDATED_POST_INFO)
                .expect(200, done);
        });
    });
});
describe('DELETE "api/posts/:postId"', () => {
    describe('returns an error response when:', () => {
        test('request is unauthenticated', done => {
            (0, supertest_1.default)(app)
                .delete('/posts/' + postId)
                .expect(401, done);
        });
        test('request is authenticated, but postId is invalid ObjectId', done => {
            (0, supertest_1.default)(app)
                .delete('/posts/' + '6310b243edf88b4a676ac54g')
                .auth(token, { type: 'bearer' })
                .expect(400, done);
        });
        test('request is authenticated, but postId does not belong to a post in db', done => {
            (0, supertest_1.default)(app)
                .delete('/posts/' + '6310b243edf88b4a676ac549')
                .auth(token, { type: 'bearer' })
                .expect(404, done);
        });
    });
    describe('deletes a post and returns a success response when: ', () => {
        test('request is authenticated, and postId matches a post in db', done => {
            (0, supertest_1.default)(app)
                .delete('/posts/' + postId)
                .auth(token, { type: 'bearer' })
                .expect(200, done);
        });
    });
});
describe('GET "api/posts/:postId/comments"', () => {
    describe('returns an error response when: ', () => {
        test.todo('request is unauthenticated');
        test.todo('request is authenticated, but postId does not belong to a post in the db');
    });
    describe('returns a specific post\'s comments when: ', () => {
        test.todo('request is authenticated and postId belongs to a post in the db');
    });
});
describe('POST "api/posts/:postId/comments"', () => {
    describe('returns an error response when: ', () => {
        test.todo('unauthenticated');
        describe('body is: ', () => {
            test.todo('undefined');
            test.todo('a blank string');
            test.todo('greater than 300 characters');
        });
    });
    describe('creates and returns a new post comment when: ', () => {
        test.todo('request is authenticated and body meets criteria');
    });
});
describe('PUT "api/posts/:postId/comments/:commentId"', () => {
    describe('returns an error response when: ', () => {
        describe('request is: ', () => {
            test.todo('unauthenticated');
        });
        describe('commentId: ', () => {
            test.todo('does not belong to a comment in the db');
        });
        describe('body is: ', () => {
            test.todo('undefined');
            test.todo('a blank string');
            test.todo('greater than 300 characters');
        });
    });
    describe('returns an updated comment when: ', () => {
        test.todo('request is authenticated and body meets criteria');
    });
});
describe('DELETE "api/posts/:postId/comments/:commentId"', () => {
    describe('returns an error response when: ', () => {
        test.todo('request is unauthenticated');
        test.todo('request is authenticated, but the commentId does not belong to a comment in the db');
    });
    describe('deletes a comment when: ', () => {
        test.todo('request is authenticated and commentId belongs to a comment in the db');
    });
});
