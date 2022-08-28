import express from 'express';
import dotenv from 'dotenv';
import expander from 'dotenv-expand'
import request from 'supertest';

import { startupMongoServer, shutdownMongoServer } from "../mongoConfigTesting";
import authRouter from "./authRoutes";
import passport from "../passportConfig";

var env = dotenv.config();
expander.expand(env);

const app = express();
var PORT = process.env['PORT'];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', authRouter);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

beforeAll(async () => {
  await startupMongoServer();
  // create collections

});

afterAll(async () => {
  await shutdownMongoServer();

});

describe('POST "api/auth"', () => {
  describe('returns an error response when: ', () => {
    test('username provided does not match a registered user', done => {
      request(app)
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
      request(app)
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
      test.todo('not an email')
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
