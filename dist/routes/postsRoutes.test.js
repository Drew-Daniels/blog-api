"use strict";
describe('GET "api/posts"', () => {
    describe('returns an error response when: ', () => {
        describe('request is: ', () => {
            test.todo('unauthenticated');
        });
    });
    describe('returns all posts when: ', () => {
        describe('request is: ', () => {
            test.todo('authenticated');
        });
    });
});
describe('POST "api/posts"', () => {
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
    describe('creates and returns a new post when: ', () => {
        test.todo('request is authenticated, and title and body meet requirements');
    });
});
describe('GET "api/posts/:postId"', () => {
    describe('returns an error response when: ', () => {
        describe('request is: ', () => {
            test.todo('unauthenticated');
        });
        describe('postId: ', () => {
            test.todo('does not belong to a post in the db');
        });
    });
    describe('returns a post when: ', () => {
        describe('postId: ', () => {
            test.todo('belongs to a post in the db');
        });
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
        describe('request is: ', () => {
            test.todo('unauthenticated');
        });
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
