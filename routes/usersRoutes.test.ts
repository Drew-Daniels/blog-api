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
import {SEED_USER_INFO, NEW_USER_INFO, UPDATED_USER_INFO} from "../constants";

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
var userId;
beforeEach(async () => {
  userId = await startupMongoServer();
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
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .get('/users/' + userId)
        .expect(401, done);
    });
    test('request is authenticated but userId provided cannot be parsed as BSON id', done => {
      request(app)
        .get('/users/' + '630eaf711a7937a1a037d1cg')// only characters 0-9 and a-f
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated but userId does not belong to a user in the db', done => {
      request(app)
        .get('/users/' + '630eaf711a7937a1a037d1cd')
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
  });
  describe('returns user when: ', () => {
    test('request is authenticated and userId belongs to a user in the db', done => {
      request(app)
        .get('/users/' + userId)
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
});
describe('PUT /api/users/:userId', () => {
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .put('/users/' + userId)
        .send(UPDATED_USER_INFO)
        .expect(401, done);
    });
    test('request is authenticated but userId provided cannot be parsed as BSON id', done => {
      request(app)
        .put('/users/' + '630eaf711a7937a1a037d1cg')
        .auth(token, { type: 'bearer' })
        .send(UPDATED_USER_INFO)
        .expect(400, done);
    });
    test('request is authenticated, userId is valid ObjectId, but userId does not belong to a user in the db', done => {
      request(app)
        .put('/users/' + '630eaf711a7937a1a037d1cd')
        .auth(token, { type: 'bearer' })
        .send(UPDATED_USER_INFO)
        .expect(404, done);
    });
    describe('firstName is: ', () => {
      test('empty string', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, firstName: '' })
          .expect(400, done);
      });
      test('greater than 30 characters', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, firstName: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' })
          .expect(400, done);
      });
    });
    describe('lastName is: ', () => {
      test('empty string', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, lastName: '' })
          .expect(400, done);
      });
      test('greater than 30 characters', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, lastName: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' })
          .expect(400, done);
      });
    });
    describe('username is: ', () => {
      test('not an email', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, username: 'notanemail' })
          .expect(400, done);
      });
      test('greater than 30 characters', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, username: 'sYJys99JeIDaDoBhQAjmQdXUNSdkInj' })
          .expect(400, done);
      });
      test('not available', done => {
        request(app)
          .put('/users/' + userId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_USER_INFO, username: SEED_USER_INFO.username })
          .expect(409, done);
      });
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