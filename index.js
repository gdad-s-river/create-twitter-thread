const trimStart = require('lodash.trimstart');
const GraphemeSplitter = require('grapheme-splitter');
const is = require('@sindresorhus/is');

const {
  isArrayOfStrings,
  generateUniqueRandomEmoji,
  throwTypeError,
  throwError,
} = require('./utils');

const splitter = new GraphemeSplitter();

const TWEET_LENGTH = 280;
const SINGLE_SPACE = ' ';

const tweetsArray = [];

function createTwitterThreadMessages(
  originalMessageString,
  navMessage = '👇',
  unique = false,
) {
  if (
    typeof originalMessageString !== 'string' &&
    typeof navMessage !== 'string'
  ) {
    throwTypeError(
      'both the main message and navigation message should be strings',
    );
  }

  function formTweetChunks(saneMessageArray, navMessage) {
    // copy in a new variable, so as to mutate parameter
    let messageArray = saneMessageArray;
    let navDown = unique
      ? `${generateUniqueRandomEmoji()} ${navMessage}`
      : navMessage;

    const TEXT_TWEET_LENGTH = TWEET_LENGTH - navDown.length;

    if (!messageArray.length) {
      return tweetsArray;
    }

    // formTweetChunks should always be passed a 278 lengthed raw array
    // so that this only fires at the end of the last tweet chunk ;

    if (messageArray.length < TEXT_TWEET_LENGTH) {
      tweetsArray.push(messageArray.join('').trim());
      return tweetsArray;
    }

    let tweetArray = messageArray.slice(0, TEXT_TWEET_LENGTH);

    const charAtNextStartPoint = messageArray[tweetArray.length];

    {
      if (charAtNextStartPoint === SINGLE_SPACE) {
        // it's not a split word = ✅; push it
        tweetsArray.push(trimStart(`${tweetArray.join('')} ${navDown}`));
      } else {
        // word got cut out, remove that whole word from this time's push

        const lastIndexOfWhiteSpace = tweetArray.lastIndexOf(SINGLE_SPACE);

        tweetArray = messageArray.slice(0, lastIndexOfWhiteSpace);

        tweetsArray.push(`${tweetArray.join('')} ${navDown}`);
      }
    }

    const newMessageStartingIndex = tweetArray.length + 1;

    const nextMessage = messageArray.slice(
      newMessageStartingIndex,
      messageArray.length,
    );

    return formTweetChunks(nextMessage, navMessage);
  }

  const saneMessageArray = splitter.splitGraphemes(originalMessageString);
  return formTweetChunks(saneMessageArray, navMessage);
}

module.exports = createTwitterThreadMessages;
exports.TWEET_LENGTH = TWEET_LENGTH;