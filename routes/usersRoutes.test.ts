import express from 'express';
import dotenv from 'dotenv';
import expander from 'dotenv-expand'
import request from 'supertest';

var env = dotenv.config();
expander.expand(env);

const app = express();
var PORT = process.env['PORT'];

import { startupMongoServer, shutdownMongoServer } from "../mongoConfigTesting";
import passport from "../passportConfig";
import authRouter from "./authRoutes";
import usersRouter from './usersRoutes';
import { SEED_USER_INFO, NEW_USER_INFO } from "../constants";

const creds = { username: SEED_USER_INFO.username, password: SEED_USER_INFO.password };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);

const server = app.listen(() => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

var token: string;
beforeEach(async () => {
  await startupMongoServer()
  const response = await request(app)
    .post('/auth')
    .send(creds)
  token = response.body.token;
});

afterEach(async () => {
  await shutdownMongoServer();
  server.close();
});

describe('GET /api/users', () => {
  const ENDPOINT = '/users';
  test('returns an error response when request is unauthenticated', done => {
    request(app)
      .get(ENDPOINT)
      .expect(401, done);
  });
  test('returns all users when request is authenticated', done => {
    request(app)
      .get(ENDPOINT)
      .auth(token, { type: 'bearer' })
      .expect(200, done);
  });
});
describe('GET /api/users/:userId', () => {
  // const ENDPOINT = `/users/${}`;
  describe('returns an error response when: ', () => {
    // test('request is unauthenticated', done => {
    //   request(app)
    //     .get(ENDPOINT)
    //     .send()
    // });
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