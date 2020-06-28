/* eslint-disable no-use-before-define */
const util = require('util');
const {
  str, parse, many, seq, lazy, numbers, oneOf, whitespace,
} = require('./index');

// numbers array that can have other numbers array
// valid :
// [1]
// [1,2, [1,2,3]]
// [1, [1,2 , [4,5,6]]]

// invalid:
// []  <- empty
// [1 [1,3 ]]  <- missing comma
// [2 [4 6 ] <- missing matching brackets

const optionalSpace = whitespace({
  optional: true,
  revamp: () => null,
});

const validArrayMember = lazy(() => oneOf({
  parsers: [numbers({ revamp: Number }), numbersArray, optionalSpace],
}));

const valueThenComma = seq({
  parsers: [validArrayMember, str(',', { optional: true })],
  revamp: (arr) => arr[0],
});

const numbersArray = seq({
  parsers: [
    str('['),
    many(valueThenComma, {
      min: 1,
      revamp: (arr) => arr.filter((i) => i !== null),
    }),
    str(']'),
  ],
  revamp: (arr) => arr[1],
});

const ast = parse({
  parser: numbersArray,
  input: '[1, 2,   3, 44, [10, 30, 500, [500, 500, 300] ] ]',
  // debugMode: true,
});

console.log(ast);

// console.log(util.inspect(ast, { showHidden: false, depth: null }));
