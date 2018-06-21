import is from '@sindresorhus/is';
import {
  extractSane280,
  injectString,
  throwError,
  throwTypeError,
  wordIt,
  TWEET_LENGTH,
} from './utils/';

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
      const { result: prevResult, carryOver, join: joinCarryOver } = acc;

      // copied to mutate later
      let newResult = prevResult;

      let newCarryOver = carryOver
        ? !joinCarryOver
          ? ` ${carryOver} `
          : ` ${carryOver}`
        : carryOver;

      let carryAddedTweet;

      if (!prevResult.length) {
        // first iteration
        if (threadTo.own) {
          newResult.push(currentVal);
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

      newResult.push(sane280);

      return { result: newResult, carryOver: saneCutPart, join: join };
    },
    { result: [], carryOver: '', join: false },
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
