describe('POST "api/auth"', () => {
  describe('returns an error response when: ', () => {
    test.todo('username provided does not match a registered user');
    test.todo('password provided does not match a registered user');
  });
  describe('returns authenticated user w/ token when: ', () => {
    test.todo('registered user provides correct credentials');
  });
});

describe('POST "api/auth/signup"', () => {
  describe('returns an error response when: ', () => {
    // TODO: Make these tests less redundant
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
