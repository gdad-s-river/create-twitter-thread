const { random } = require('node-emoji');

let previousEmoji = random().emoji;

function generateUniqueRandomEmoji() {
  let currentEmoji = random().emoji;
  if (previousEmoji === currentEmoji) {
    return generateUniqueRandomEmoji(previousEmoji);
  }

  previousEmoji = currentEmoji;
  return currentEmoji;
}

module.exports = generateUniqueRandomEmoji;
