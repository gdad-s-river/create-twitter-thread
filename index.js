const trimStart = require('lodash.trimstart');

const TWEET_LENGTH = 280;
const SINGLE_SPACE = ' ';

const tweetsArray = [];

function createTwitterThreadMessages(originalMessage, navMessage = '👇') {
	if (typeof originalMessage !== 'string' && typeof navMessage !== 'string') {
		throw new TypeError(
			'both the main message and navigation message should be strings',
		);
	}

	function formTweetChunks(message, navMessage) {
		const SINGLE_SPACE = ' ';
		const TEXT_TWEET_LENGTH = TWEET_LENGTH - navMessage.length;

		if (!message.length) {
			return tweetsArray;
		}

		// formTweetChunks should always be passed a 278 lengthed raw array
		// so that this only fires at the end of the last tweet chunk;

		if (message.length < TEXT_TWEET_LENGTH) {
			tweetsArray.push(trimStart(message));
			return tweetsArray;
		}

		let tweetLengthRawString = trimStart(message.substr(0, TEXT_TWEET_LENGTH));

		const charAtNextStartPoint = message[tweetLengthRawString.length];

		{
			if (charAtNextStartPoint === SINGLE_SPACE) {
				// it's not a split word = ✅; push it
				tweetsArray.push(`${tweetLengthRawString} ${navMessage}`);
			} else {
				// word got cut out, remove that whole word
				// from this time's push

				const lastIndexOfWhiteSpace = tweetLengthRawString.lastIndexOf(
					SINGLE_SPACE,
				);

				tweetLengthRawString = message.substr(0, lastIndexOfWhiteSpace);

				tweetsArray.push(`${tweetLengthRawString} ${navMessage}`);
			}
		}

		const newMessageStartingIndex = tweetLengthRawString.length + 1;
		// the second argument will always be greater than
		// the length of the nextMessage. To be exact
		// it should be something like message.length - tweetLengthRawString.length
		// but I think we wouldn't need to be exact
		const nextMessage = message.substr(newMessageStartingIndex, message.length);

		return formTweetChunks(nextMessage, navMessage);
	}

	return formTweetChunks(originalMessage, navMessage);
}

module.exports = createTwitterThreadMessages;
