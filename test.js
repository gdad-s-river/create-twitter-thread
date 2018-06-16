const test = require('ava');
const { isArrayOfStrings, throwError, throwTypeError } = require('./utils');

const testString = require('./testString');
const createTwitterThreadMessages = require('./index.js');
const TWEET_LENGTH = require('./index.js').TWEET_LENGTH;

test.before(t => {
  t.context.tweetsArray = createTwitterThreadMessages(testString);
});

test('tweetsArray should be an array of strings', t => {
  if (!isArrayOfStrings(t.context.tweetsArray)) {
    // ensure that it throws a typeerror
    t.throws(() => {
      throwTypeError('Should be an array of strings');
    }, TypeError);
  } else {
    t.pass();
  }
});

test('each tweet should have length < 280', t => {
  t.context.tweetsArray.forEach(tweet => {
    if (tweet.length > TWEET_LENGTH) {
      t.throws(() => {
        throwError(`Tweet's length should be less than 280`);
      });
    } else {
      t.pass();
    }
  });
});
