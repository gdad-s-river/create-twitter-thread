const trimStart = require('lodash.trimstart');
const GraphemeSplitter = require('grapheme-splitter');

const splitter = new GraphemeSplitter();

const TWEET_LENGTH = 280;
const SINGLE_SPACE = ' ';

const tweetsArray = [];

function createTwitterThreadMessages(originalMessageString, navMessage = '👇') {
  if (
    typeof originalMessageString !== 'string' &&
    typeof navMessage !== 'string'
  ) {
    throw new TypeError(
      'both the main message and navigation message should be strings',
    );
  }

  function formTweetChunks(saneMessageArray, navMessage) {
    const TEXT_TWEET_LENGTH = TWEET_LENGTH - navMessage.length;

    if (!saneMessageArray.length) {
      return tweetsArray;
    }

    // formTweetChunks should always be passed a 278 lengthed raw array
    // so that this only fires at the end of the last tweet chunk ;

    if (saneMessageArray.length < TEXT_TWEET_LENGTH) {
      tweetsArray.push(saneMessageArray.join('').trim());
      return tweetsArray;
    }

    let tweetLengthArray = saneMessageArray.slice(0, TEXT_TWEET_LENGTH);

    const charAtNextStartPoint = saneMessageArray[saneMessageArray.length];

    {
      if (charAtNextStartPoint === SINGLE_SPACE) {
        // it's not a split word = ✅; push it
        tweetsArray.push(
          trimStart(`${tweetLengthArray.join('')} ${navMessage}`),
        );
      } else {
        // word got cut out, remove that whole word from this time's push

        const lastIndexOfWhiteSpace = tweetLengthArray.lastIndexOf(
          SINGLE_SPACE,
        );

        tweetLengthArray = saneMessageArray.slice(0, lastIndexOfWhiteSpace);

        tweetsArray.push(`${tweetLengthArray.join('')} ${navMessage}`);
      }
    }

    const newMessageStartingIndex = tweetLengthArray.length + 1;

    const nextMessage = saneMessageArray.slice(
      newMessageStartingIndex,
      saneMessageArray.length,
    );

    return formTweetChunks(nextMessage, navMessage);
  }

  const saneMessageArray = splitter.splitGraphemes(originalMessageString);
  return formTweetChunks(saneMessageArray, navMessage);
}

module.exports = createTwitterThreadMessages;
exports.TWEET_LENGTH = TWEET_LENGTH;
