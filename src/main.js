import is from '@sindresorhus/is';
import MutationEmitter from './events';
import {
  extractSane280,
  injectString,
  SINGLE_SPACE,
  throwError,
  throwTypeError,
  TWEET_LENGTH,
  wordIt,
} from './utils/';

const EMPTY_STRING = '';
/**
 * dontPadRight boolean
 * needed for special edgecase where
 * there are no spaces in the formed tweet (see line #60, src/utils/index.js)
 * during the reduce function execution below
 */
let dontPadRight = false;
MutationEmitter.on('mutateVariable', newValue => {
  dontPadRight = newValue;
});

export default function createTwitterThreadMessages(message, threadObject) {
  let threadTo =
    threadObject && threadObject.threadTo ? threadObject.threadTo : undefined;
  const untinkeredChunks = formTweetsArray(message);

  if (!threadTo) {
    return untinkeredChunks;
  }

  const handleValue = threadTo[Object.keys(threadTo)[0]];

  const { result, carryOver: lastCarryOver } = getSaneTweetsWithHandles(
    untinkeredChunks,
    handleValue,
    threadTo,
    TWEET_LENGTH,
  );

  return lastCarryOver
    ? [...result, `${handleValue} ${lastCarryOver}`]
    : result;
}

function getSaneTweetsWithHandles(
  untinkeredChunks,
  handleValue,
  threadTo,
  TWEET_LENGTH,
) {
  const returnVal = untinkeredChunks.reduce(
    (acc, currentVal, currentIndex) => {
      const { result: prevResult, carryOver } = acc;
      // copied to mutate later
      let newResult = prevResult;

      const leftPadToCarryOver =
        carryOver.indexOf(SINGLE_SPACE) === 0 ? EMPTY_STRING : SINGLE_SPACE;
      const rightPadToCarryOver =
        carryOver.lastIndexOf(SINGLE_SPACE) === carryOver.length - 1
          ? EMPTY_STRING
          : dontPadRight
            ? EMPTY_STRING
            : SINGLE_SPACE;

      let newCarryOver = `${leftPadToCarryOver}${carryOver}${rightPadToCarryOver}`;

      let carryAddedTweet;

      if (currentIndex === 0) {
        // first iteration
        if (threadTo.own) {
          newResult.push(currentVal.trim());
          return {
            result: newResult,
            carryOver: newCarryOver, // unchanged ''
          };
        }
      }

      carryAddedTweet = injectString(currentVal, {
        start: 0,
        delCount: 0,
        newSubStr: `${handleValue}${newCarryOver}`,
      });
      // do the sanity
      const sane280Untested = extractSane280(carryAddedTweet, TWEET_LENGTH);

      const { sane280, saneCutPart, join } = wordIt(
        sane280Untested,
        carryAddedTweet,
        handleValue,
      );

      newResult.push(sane280.trim());

      return { result: newResult, carryOver: saneCutPart.trim(), join: join };
    },
    { result: [], carryOver: '' },
  );

  return returnVal;
}

function formTweetsArray(message) {
  let tweetsArray = [];

  function recursiveFunctionFormingThread(message) {
    if (!message) {
      throwError('first argument is mandatory');
    }

    if (!is.string(message)) {
      throwTypeError('first argument (message) should be a string');
    }

    if (!message.length) {
      return tweetsArray;
    }

    if (message.trim().length <= TWEET_LENGTH) {
      tweetsArray.push(message.trim());
      return tweetsArray;
    }

    const sane280Untested = extractSane280(message, TWEET_LENGTH);
    const { sane280, saneCutPart: nextMessage } = wordIt(
      sane280Untested,
      message,
    );

    tweetsArray.push(sane280.trim());

    return recursiveFunctionFormingThread(nextMessage);
  }

  return recursiveFunctionFormingThread(message);
}
