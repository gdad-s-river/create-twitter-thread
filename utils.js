const generateUniqueRandomEmoji = require('./generateUniqueRandomEmoji');

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

exports.isArrayOfStrings = isArrayOfStrings;
exports.throwError = throwError;
exports.throwTypeError = throwTypeError;
exports.generateUniqueRandomEmoji = generateUniqueRandomEmoji;
