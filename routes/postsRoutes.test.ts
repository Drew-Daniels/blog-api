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
import {
  SEED_USER_INFO,
  NEW_POST_INFO,
  UPDATED_POST_INFO,
  NEW_COMMENT_INFO,
  UPDATED_COMMENT_INFO
} from "../constants";

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
var commentId;
beforeEach(async () => {
  const seedInfo = await startupMongoServer();

  userId = seedInfo.seedUserId;
  postId = seedInfo.seedPostId;
  commentId = seedInfo.seedCommentId;

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
    test('request is authenticated but postId is not a valid ObjectId', done => {
      request(app)
        .get('/posts/' + '6310aede9f3ebc201714e0eg')
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated but postId does not belong to a post in the db', done => {
      request(app)
        .get('/posts/' + '6310aede9f3ebc201714e0e9')
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
  });
  describe('returns a post when: ', () => {
    test('request is authenticated and postId belongs to a post in the db', done => {
      request(app)
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
        request(app)
          .put('/posts/' + postId)
          .send(UPDATED_POST_INFO)
          .expect(401, done);
      });
    });
    describe('title is: ', () => {
      test('a blank string', done => {
        request(app)
          .put('/posts/' + postId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_POST_INFO, title: '' })
          .expect(400, done);
      });
      test('greater than 100 characters', done => {
        request(app)
          .put('/posts/' + postId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_POST_INFO, title: 'y08vKU0RkDQSuOxE1UIeViK695gdpptYadXOTP1zHR65kvMreADA8Kv00F7Axrs80t7Pvajhrtauq5e26c6aYmy6WqMgkHc5Za01j' })
          .expect(400, done);
      });
    });
    describe('body is: ', () => {
      test('a blank string', done => {
        request(app)
          .put('/posts/' + postId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_POST_INFO, body: '' })
          .expect(400, done);
      });
      test('greater than 300 characters', done => {
        request(app)
          .put('/posts/' + postId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_POST_INFO, body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj' })
          .expect(400, done);
      });
    });
  });
  describe('returns an updated post when: ', () => {
    test('request is authenticated, and title and body meet requirements', done => {
      request(app)
        .put('/posts/' + postId)
        .auth(token, { type: 'bearer' })
        .send(UPDATED_POST_INFO)
        .expect(200, done);
    });
  });
});
describe('DELETE "api/posts/:postId"', () => {
  describe('returns an error response when:', () => {
    test('request is unauthenticated', done => {
      request(app)
        .delete('/posts/' + postId)
        .expect(401, done);
    });
    test('request is authenticated, but postId is invalid ObjectId', done => {
      request(app)
        .delete('/posts/' + '6310b243edf88b4a676ac54g')
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated, but postId does not belong to a post in db', done => {
      request(app)
        .delete('/posts/' + '6310b243edf88b4a676ac549')
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
  });
  describe('deletes a post and returns a success response when: ', () => {
    test('request is authenticated, and postId matches a post in db', done => {
      request(app)
        .delete('/posts/' + postId)
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
});
describe('GET "api/posts/:postId/comments"', () => {
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .get('/posts/' + postId + '/comments')
        .expect(401, done);
    });
    test('request is authenticated, but postId is not a valid ObjectId', done => {
      request(app)
        .get('/posts/' + '6310b243edf88b4a676ac54g' + '/comments')
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated, but postId does not belong to a post in the db', done => {
      request(app)
        .get('/posts/' + '6310b243edf88b4a676ac549' + '/comments')
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
  });
  describe('returns a specific post\'s comments when: ', () => {
    test('request is authenticated and postId belongs to a post in the db', done => {
      request(app)
        .get('/posts/' + postId + '/comments')
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
});
describe('POST "api/posts/:postId/comments"', () => {
  describe('returns an error response when: ', () => {
    describe('request is: ', () => {
      test('unauthenticated', done => {
        request(app)
          .post('/posts/' + postId + '/comments')
          .send(NEW_COMMENT_INFO)
          .expect(401, done);
      });
    });
    describe('body is: ', () => {
      test('a blank string', done => {
        request(app)
          .post('/posts/' + postId + '/comments')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_COMMENT_INFO, body: ''})
          .expect(400, done);
      });
      test('greater than 300 characters', done => {
        request(app)
          .post('/posts/' + postId + '/comments')
          .auth(token, { type: 'bearer' })
          .send({ ...NEW_COMMENT_INFO, body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj'})
          .expect(400, done);
      });
    });
  });
  describe('creates and returns a new post comment when: ', () => {
    test('request is authenticated and body meets criteria', done => {
      request(app)
        .post('/posts/' + postId + '/comments')
        .auth(token, { type: 'bearer' })
        .send(NEW_COMMENT_INFO)
        .expect(200, done);
    });
  });
});
describe('PUT "api/posts/:postId/comments/:commentId"', () => {
  describe('returns an error response when: ', () => {
    describe('request is: ', () => {
      test('unauthenticated', done => {
        request(app)
          .put('/posts/' + postId + '/comments/' + commentId)
          .send(UPDATED_COMMENT_INFO)
          .expect(401, done);
      });
    });
    describe('request is authenticated, but postId: ', () => {
      test('is not a valid ObjectId', done => {
        request(app)
          .put('/posts/' + '6310b243edf88b4a676ac54g' + '/comments/' + commentId)
          .auth(token, { type: 'bearer' })
          .send(UPDATED_COMMENT_INFO)
          .expect(400, done);
      });
      test('does not belong to a post in db', done => {
        request(app)
          .put('/posts/' + '6310b243edf88b4a676ac549' + '/comments/' + commentId)
          .auth(token, { type: 'bearer' })
          .send(UPDATED_COMMENT_INFO)
          .expect(404, done);
      });
    })
    describe('request is authenticated, but commentId: ', () => {
      test('is not a valid ObjectId', done => {
        request(app)
          .put('/posts/' + postId + '/comments/' + '6310b243edf88b4a676ac54g')
          .auth(token, { type: 'bearer' })
          .send(UPDATED_COMMENT_INFO)
          .expect(400, done);
      });
      test('does not belong to a comment in the db', done => {
        request(app)
          .put('/posts/' + postId + '/comments/' + '6310b243edf88b4a676ac549')
          .auth(token, { type: 'bearer' })
          .send(UPDATED_COMMENT_INFO)
          .expect(404, done);
      });
    });
    describe('body is: ', () => {
      test('a blank string', done => {
        request(app)
          .put('/posts/' + postId + '/comments/' + commentId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_COMMENT_INFO, body: '' })
          .expect(400, done);
      });
      test('greater than 300 characters', done => {
        request(app)
          .put('/posts/' + postId + '/comments/' + commentId)
          .auth(token, { type: 'bearer' })
          .send({ ...UPDATED_COMMENT_INFO, body: 'ty9SFTcbYGAH9TurIuER5AQ0LUh9u3Mk56A76SpQ5pJWop6MqjkE9nCsokgJIfqsvPB1CmQV5v4X7o6xyEaUwqCDGl6W44looYlt2Iqop4RpEWRow63H8ozzbtaRcNGUaRiUVB7pgCADzqOpn1ENKoM8UVr4aZjjONPW1Tn6HTA2SrgghXR8XQQ9YztDARGuJ5rXZaJ5byFvlnI830l360kegGboHtZPQZaTUfyiiw9oLFwEHhxicNb7KzCebdB5j7QT6BETgmAve8LdfT8Wr0C6R7Bw07byDM6aQWNYwezGj' })
          .expect(400, done);
      });
    });
  });
  describe('returns an updated comment when: ', () => {
    test('request is authenticated and body meets criteria', done => {
      request(app)
        .put('/posts/' + postId + '/comments/' + commentId)
        .auth(token, { type: 'bearer' })
        .send(UPDATED_COMMENT_INFO)
        .expect(200, done);
    });
  });
});
describe('DELETE "api/posts/:postId/comments/:commentId"', () => {
  describe('returns an error response when: ', () => {
    test('request is unauthenticated', done => {
      request(app)
        .delete('/posts/' + postId + '/comments/' + commentId)
        .expect(401, done);
    });
    test('request is authenticated, but the postId is not a valid ObjectId', done => {
      request(app)
        .delete('/posts/' + '6310b243edf88b4a676ac54g' + '/comments/' + commentId)
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated, but the postId does not belong to a post in the db', done => {
      request(app)
        .delete('/posts/' + '6310b243edf88b4a676ac549' + '/comments/' + commentId)
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
    test('request is authenticated, but the commentId is not a valid ObjectId', done => {
      request(app)
        .delete('/posts/' + postId + '/comments/' + '6310b243edf88b4a676ac54g')
        .auth(token, { type: 'bearer' })
        .expect(400, done);
    });
    test('request is authenticated, but the commentId does not belong to a comment in the db', done => {
      request(app)
        .delete('/posts/' + postId + '/comments/' + '6310b243edf88b4a676ac549')
        .auth(token, { type: 'bearer' })
        .expect(404, done);
    });
  });
  describe('deletes a comment when: ', () => {
    test('request is authenticated and commentId belongs to a comment in the db', done => {
      request(app)
        .delete('/posts/' + postId + '/comments/' + commentId)
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
});
