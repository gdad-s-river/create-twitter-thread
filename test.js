import test from 'ava';
import is from '@sindresorhus/is';
import createTwitterThreadMessages from './main';
import testStrings from './testStrings';
import { isArrayOfStrings, throwTypeError, TWEET_LENGTH } from './utils';
// import clipboard from 'copy-paste';

const testStringsObject = testStrings;

const noop = () => {};
const _ = undefined;
// fixture
let threads = {
  withoutHandles: [],
  withHandles: {
    ownThreads: [],
    otherThreads: [],
  },
};

const ownHandle = `@bewarehdfcergo`;
const otherHandle = `@dynamichandle`;

Object.keys(testStrings).forEach(testStringKey => {
  const testString = testStrings[testStringKey];
  threads.withoutHandles.push(createTwitterThreadMessages(testString));

  threads.withHandles.ownThreads.push(
    createTwitterThreadMessages(testString, {
      threadTo: { own: ownHandle },
    }),
  );

  threads.withHandles.otherThreads.push(
    createTwitterThreadMessages(testString, {
      threadTo: { other: otherHandle },
    }),
  );
});

test.before(t => {
  t.context.threads = threads;

  t.context.runTestsOnFixtures = (
    typeOfThreads = ['withHandles', 'withoutHandles'], // array
    runAssertionsOnThread = noop,
    runAssertionsOnTweet = noop,
  ) => {
    if (typeOfThreads.includes('withoutHandles')) {
      t.context.threads.withoutHandles.forEach(threadWithoutHandle => {
        runAssertionsOnThread(threadWithoutHandle);
        threadWithoutHandle.forEach(tweetWithoutHandles => {
          runAssertionsOnTweet(tweetWithoutHandles);
        });
      });
    }

    if (typeOfThreads.includes('withHandles')) {
      const withHandlesObject = threads.withHandles;
      for (let key in withHandlesObject) {
        if (withHandlesObject.hasOwnProperty(key)) {
          withHandlesObject[key].forEach(threadWithHandle => {
            runAssertionsOnThread(threadWithHandle);
            threadWithHandle.forEach(tweet => {
              runAssertionsOnTweet(tweet);
            });
          });
        }
      }
    }
  };
});

test('All threads should be array of strings', t => {
  t.context.runTestsOnFixtures(
    _,
    thread => {
      t.true(is.array(thread));
    },
    tweet => {
      t.true(is.string(tweet));
    },
  );
});

test('All tweets should be of proper length (<= 280)', t => {
  t.context.runTestsOnFixtures(_, noop, tweet => {
    t.true(tweet.length <= TWEET_LENGTH);
  });
});

test('Tweets should have necessary handles if they are created with threadTo option', t => {
  t.context.runTestsOnFixtures(
    ['withHandles'],
    thread => {
      for (const entry of thread.entries()) {
        const index = entry[0];
        const value = entry[1];

        // first tweet
        if (index === 0) {
          t.test(value.indexOf());
        }
      }
    },
    noop,
  );
  // t.pass();
});
