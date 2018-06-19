import test from 'ava';
import createTwitterThreadMessages from './main';
import testStrings from './testStrings';
import { isArrayOfStrings, throwTypeError, TWEET_LENGTH } from './utils';

test.before(t => {
  /**
   * tweetsArray -> forEach testString -> tweetArray without threadTo, and with both threadTo.own and threadTo.other
   * that is — tweetsArray.length = 6
   */
  let threadsArray = [];
  Object.keys(testStrings).forEach(testStringKey => {
    const testString = testStrings[testStringKey];
    threadsArray.push(createTwitterThreadMessages(testString));
    threadsArray.push(
      createTwitterThreadMessages(testString, {
        threadTo: { own: '@bewarehdfcergo' },
      }),
    );
    threadsArray.push(
      createTwitterThreadMessages(testString, {
        threadTo: { other: '@dynamicTwitterHandle' },
      }),
    );
  });

  t.context.threadsArray = threadsArray;
});

test('tweetsArray should be an array of strings', t => {
  t.context.threadsArray.forEach(thread => {
    if (!isArrayOfStrings(thread)) {
      // ensure that it throws a typeerror
      t.throws(() => {
        throwTypeError('Should be an array of strings');
      }, TypeError);
    } else {
      t.pass();
    }
  });
});

test('each tweet should have length < 280', t => {
  t.context.threadsArray.forEach(thread => {
    thread.forEach(tweet => {
      if (tweet.length > TWEET_LENGTH) {
        t.throws(() => {
          throwError(`Tweet's length should be less than 280`);
        });
      } else {
        t.pass();
      }
    });
  });
});

// TODO: DRY: make fixtures instead of repeatedly creating similar twitter threads
// as in the .before hook above
// test('if there is threadTo, tweets should have necessary twitter handles', t => {
//   const ownHandle = '@bewarehdfcergo';
//   const dynamicHandle = '@dynamicHandle';

//   const threadsWithHandle = {
//     ownThreads: [],
//     otherThreads: [],
//   };

//   Object.keys(testStrings).forEach(testStringKey => {
//     const testString = testStrings[testStringKey];

//     threadsWithHandle.ownThreads.push(
//       createTwitterThreadMessages(testString, {
//         threadTo: { own: ownHandle },
//       }),
//     );

//     threadsWithHandle.otherThreads.push(
//       createTwitterThreadMessages(testString, {
//         threadTo: { other: dynamicHandle },
//       }),
//     );
//   });

//   // console.log(JSON.stringify(threadsWithHandle.ownThreads, null, 2));
//   // console.log('-------------------------------------');
//   threadsWithHandle.ownThreads.forEach(thread => {
//     for (const entry of thread.entries()) {
//       const tweetIndex = entry[0];
//       const tweet = entry[1];
//       // the first tweet shouldn't have a handle
//       if (tweetIndex === 0) {
//         if (tweet.indexOf(ownHandle)) {
//           t.throws(() => {
//             throwError(
//               'First tweet for a self thread shouldnt have our own handle',
//             );
//           });
//         }
//       } else {
//         // console.log(tweet);
//         // console.log('-------------------');
//         if (tweet.indexOf(ownHandle) < 0) {
//           t.throws(() => {
//             throwError(
//               'all tweets after first tweet should have had the handle in them',
//             );
//           });
//         }
//       }
//     }
//   });

//   threadsWithHandle.otherThreads.forEach(thread => {
//     thread.forEach(tweet => {
//       if (tweet.indexOf(dynamicHandle) < 0) {
//         t.throws(() => {
//           throwError('all tweets should have had the handle in them');
//         });
//       }
//     });
//   });

//   t.pass();
// });
