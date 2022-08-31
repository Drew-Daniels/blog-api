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
import postsRouter from "./postsRoutes";
import { SEED_USER_INFO, NEW_POST_INFO } from "../constants";

const creds = { username: SEED_USER_INFO.username, password: SEED_USER_INFO.password };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);

const server = app.listen(() => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

var token: string;
var userId;
var postId;
beforeEach(async () => {
  const seedInfo = await startupMongoServer();
  userId = seedInfo.seedUserId;
  postId = seedInfo.seedPostId;
  const response = await request(app)
    .post('/auth')
    .send(creds)
  token = response.body.token;
});

afterEach(async () => {
  await shutdownMongoServer();
  server.close();
});

describe('GET "api/posts"', () => {
  test('returns an error response when request is unauthenticated', done => {
    request(app)
      .get('/posts')
      .expect(401, done);
  });
  test('returns all posts when request is authenticated', done => {
    request(app)
      .get('/posts')
      .auth(token, { type: 'bearer' })
      .expect(200, done);
  });
});
describe('POST "api/posts"', () => {
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .post('/posts')
        .send(NEW_POST_INFO)
        .expect(401, done);
    });
    describe('request is authenticated, but title is: ', () => {
      test('undefined', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, title: undefined })
          .expect(400, done);
      });
      test('a blank string', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, title: '' })
          .expect(400, done);
      });
      test('greater than 100 characters', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, title: 'y08vKU0RkDQSuOxE1UIeViK695gdpptYadXOTP1zHR65kvMreADA8Kv00F7Axrs80t7Pvajhrtauq5e26c6aYmy6WqMgkHc5Za01j' })
          .expect(400, done);
      });
    });
    describe('request is authenticated, but body is: ', () => {
      test('undefined', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, body: undefined })
          .expect(400, done);
      });
      test('a blank string', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, body: '' })
          .expect(400, done);
      });
      test('greater than 300 characters', done => {
        request(app)
          .post('/posts')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_POST_INFO, body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj' })
          .expect(400, done);
      });
    });
  });
  describe('returns a success response when: ', () => {
    test('creates and returns a new post when request is authenticated, and title and body meet requirements', done => {
      request(app)
        .post('/posts')
        .auth(token, { type: 'bearer' })
        .send(NEW_POST_INFO)
        .expect(200, done);
    });
  })
});
describe('GET "api/posts/:postId"', () => {
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .get('/posts/' + postId)
        .expect(401, done);
    });
    test.todo('request is authenticated but postId does not belong to a post in the db');
  });
  describe('returns a post when: ', () => {
    test.todo('request is authenticated and postId belongs to a post in the db');
  });
});
describe('PUT "api/posts/:postId"', () => {
  describe('returns an error response when: ', () => {
    describe('request is: ', () => {
      test.todo('unauthenticated');
    });
    describe('title is: ', () => {
      test.todo('undefined');
      test.todo('a blank string');
      test.todo('greater than 100 characters');
    });
    describe('body is: ', () => {
      test.todo('undefined');
      test.todo('a blank string');
      test.todo('greater than 300 characters');
    });
  });
  describe('returns an updated post when: ', () => {
    test.todo('request is authenticated, and title and body meet requirements');
  });
});
describe('DELETE "api/posts/:postId"', () => {
  test.todo('returns an error response when  request is unauthenticated');
  test.todo('returns a success response when request is authenticated');
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
