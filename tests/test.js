import is from '@sindresorhus/is';
import test from 'ava';
import createTwitterThreadMessages from '../src/main';
// TODO: test on many randomized strings instead of just two (open issue for it)
import testStrings from './testStrings';
import { TWEET_LENGTH } from '../src/utils';

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
    typeOfThreads = [
      'withHandles',
      'withoutHandles',
      ...Object.keys(threads.withHandles),
    ],
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
        if (typeOfThreads.includes(key)) {
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
    ['withHandles', 'ownThreads'],
    thread => {
      for (const entry of thread.entries()) {
        const index = entry[0];
        const tweetValue = entry[1];

        if (index === 0) {
          // first tweet
          t.true(tweetValue.indexOf(ownHandle) < 0);
        } else {
          t.true(tweetValue.indexOf(ownHandle) === 0);
          t.true(tweetValue.charAt(ownHandle.length) === ' ');
          t.true(tweetValue.charAt(ownHandle.length + 1) !== ' ');
        }
      }
    },
    noop,
  );

  t.context.runTestsOnFixtures(['withHandles', 'otherThreads'], thread => {
    for (const entry of thread.entries()) {
      const index = entry[0];
      const tweetValue = entry[1];

      t.true(tweetValue.indexOf(otherHandle) === 0);
      t.true(tweetValue.charAt(otherHandle.length) === ' ');
      t.true(tweetValue.charAt(otherHandle.length + 1) !== ' ');
    }
  });
});
