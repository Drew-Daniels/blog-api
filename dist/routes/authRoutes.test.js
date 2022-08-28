"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/', authRoutes_1.default);
describe('POST "api/auth"', () => {
    describe('returns an error response when: ', () => {
        test('username provided does not match a registered user', done => {
            (0, supertest_1.default)(app)
                .post('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', '/json/')
                .expect({ username: 'bob@dobbs.com', password: '6JtxHvbnAh$@V9AM' })
                .expect(401, done);
        });
        test.todo('password provided does not match a registered user');
    });
    describe('returns authenticated user w/ token when: ', () => {
        test('registered user provides correct credentials', done => {
            (0, supertest_1.default)(app)
                .post('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', '/json/')
                .expect({ username: 'bob@dobbs.comz', password: '6JtxHvbnAh$@V9AM' })
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
