import express from 'express';
import dotenv from 'dotenv';
import expander from 'dotenv-expand'
import request from 'supertest';

import { startupMongoServer, shutdownMongoServer } from "../mongoConfigTesting";
import authRouter from "./authRoutes";
import passport from "../passportConfig";
import { SEED_USER_INFO, NEW_USER_INFO} from "../constants";

var env = dotenv.config();
expander.expand(env);

const app = express();
var PORT = process.env['PORT'];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', authRouter);

const server = app.listen(() => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

beforeEach(async () => {
  await startupMongoServer();
});

afterEach(async () => {
  await shutdownMongoServer();
  server.close();
});

describe('POST "api/auth"', () => {
  describe('returns an error response when: ', () => {
    test('username provided does not match a registered user', done => {
      request(app)
        .post('/')
        // missing last character in username
        .send({ username: 'john@who.com', password: SEED_USER_INFO.password })
        .expect(401, done);
    });
    test('password provided does not match a registered user', done => {
      request(app)
        .post('/')
        // missing last character in pwd
        .send({ username: SEED_USER_INFO.username, password: '6JtxHvbnAh$@V9A' })
        .expect(401, done);
    });
  });
  describe('returns authenticated user w/ token when: ', () => {
    test('registered user provides correct credentials', done => {
      request(app)
        .post('/')
        .send({ username: SEED_USER_INFO.username, password: SEED_USER_INFO.password })
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(expect.objectContaining({
            user: expect.any(Object),
            token: expect.any(String),
          }));
          done();
        })
    });
  });
});

describe('POST "api/auth/signup"', () => {
  const ENDPOINT = '/signup';
  describe('returns an error response when: ', () => {
    describe('firstName is: ', () => {
      test('undefined', done => {
        const body = { ...SEED_USER_INFO, firstName: undefined };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('not a string', done => {
        const body = { ...SEED_USER_INFO, firstName: 4 };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('empty string', done => {
        const body = { ...SEED_USER_INFO, firstName: '' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('greater than 30 characters', done => {
        const body = { ...SEED_USER_INFO, firstName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar lectus ante, nec sollicitudin orci sagittis non. Nulla vehicula euismod finibus. Aliquam sed nibh justo. Proin blandit vestibulum arcu, nec fermentum.' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
    });
    describe('lastName is: ', () => {
      test('undefined', done => {
        const body = { ...SEED_USER_INFO, lastName: undefined };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('not a string', done => {
        const body = { ...SEED_USER_INFO, lastName: 4 };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('empty string', done => {
        const body = { ...SEED_USER_INFO, lastName: '' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('greater than 30 characters', done => {
        const body = { ...SEED_USER_INFO, lastName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar lectus ante, nec sollicitudin orci sagittis non. Nulla vehicula euismod finibus. Aliquam sed nibh justo. Proin blandit vestibulum arcu, nec fermentum.' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
    });
    describe('username is: ', () => {
      test('undefined', done => {
        const body = { ...SEED_USER_INFO, username: undefined };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('not an email', done => {
        const body = { ...SEED_USER_INFO, username: 'notanemail' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      })
      test('greater than 30 characters', done => {
        const body = { ...SEED_USER_INFO, username: 'thisisanemailthatiswaylongerthan30charactersandshouldbeconsidredinvalid@gmail.com' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
      test('not available', done => {
        const body = { ...SEED_USER_INFO }; // SEED_USER_INFO is used to seed db with a user prior to tests being run
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(409, done);
      });
    });
    describe('password is: ', () => {
      test('not a strong password', done => {
        const body = { ...SEED_USER_INFO, password: 'weak', passwordConfirm: 'weak' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
    });
    describe('passwordConfirm is: ', () => {
      test('different from password', done => {
        const body = { ...SEED_USER_INFO, password: '#Hgs2@u8!F4gUQ%f', passwordConfirm: '#Hgs2@u8!F4gUQ%f+++' };
        request(app)
          .post(ENDPOINT)
          .send(body)
          .expect(400, done);
      });
    });
  });
  describe('creates and returns new user when: ', () => {
    test('firstName, lastName, username, password, and passwordConfirm all meet criteria', done => {
      const body = { ...NEW_USER_INFO };
      request(app)
        .post(ENDPOINT)
        .send(body)
        .expect(200, done);
    });
  });
});
