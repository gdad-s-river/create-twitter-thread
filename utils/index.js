// const generateUniqueRandomEmoji = require('./generateUniqueRandomEmoji');
import is from '@sindresorhus/is';

const SINGLE_SPACE = ' ';

function isArrayOfStrings(x) {
  if (!Array.isArray(x))
    throw new TypeError(`Given input ${x} is not an array`);

  return x.every(i => typeof i === 'string');
}

const throwTypeError = message => {
  throw new TypeError(message);
};

const throwError = message => {
  throw new Error(message);
};

// based on this —  https://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
function injectString(str, { start, delCount, newSubStr }) {
  return (
    str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount))
  );
}

function wordIt(string, supersetString) {=
  if (!is.string(string) && !is.string(supersetString)) {
    throwTypeError(
      'both of the arguments should be strings. One or both of them wasnt string',
    );
  }

  if (supersetString.length < string.length) {
    throwError(
      `second argument's (supersetString) length should be greater than first argument's (string) length`,
    );
  }

  if (string === supersetString) {
    console.log('yeah shit');
    return {
      sane280: string,
      saneCutPart: '',
    };
  }

  if (supersetString[string.length] === SINGLE_SPACE) {
    // string's last char was the last char of a word, so it's not chopped phrase, hence return
    const saneCutPart = supersetString.slice(string.length);

    return {
      sane280: string,
      saneCutPart,
    };
  } else {
    const indexOfLastSpace = string.lastIndexOf(SINGLE_SPACE);
    // TODO — EDGE CASE — if there is no space in the string, it's a looooong word
    if (indexOfLastSpace < 0) {
      // do something to keep everything sane
      const saneCutPart = supersetString.slice(string.length);

      return {
        sane280: string,
        saneCutPart,
      };
    }

    const sane280 = string.slice(0, indexOfLastSpace);
    const saneCutPart = supersetString.slice(indexOfLastSpace + 1);

    return {
      sane280,
      saneCutPart,
    };
  }
}

function extractSane280(message, limit) {
  if (!message) {
    throwError(
      'message (first arg) is mandatory and should be a string. You didnt pass it!',
    );
  }

  if (!limit) {
    throwError(
      'you need to pass limit (second argument). It should be a number. You didnt pass it!',
    );
  }

  if (!is.string(message)) {
    throwTypeError('message (first arg) needs to be a string');
  }

  if (!is.number(limit)) {
    throwTypeError('limit (second arg) needs to be a string');
  }

  let threshHoldLength = 0;
  let str = '';

  for (const char of message) {
    const length = char.length;

    if (threshHoldLength + length <= limit) {
      threshHoldLength += length;
      str += char;
    } else {
      break;
    }
  }

  const restOfMessage = message.slice(message.length);

  return str;
}

export { isArrayOfStrings, throwError, throwTypeError, injectString, wordIt, extractSane280, SINGLE_SPACE, };

