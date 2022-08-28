describe('GET /api/users', () => {
  test.todo('returns an error response when request is unauthenticated');
  test.todo('returns all users when request is authenticated');
});
describe('GET /api/users/:userId', () => {
  describe('returns an error response when: ', () => {
    test.todo('request is unauthenticated');
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