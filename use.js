/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const util = require('util');
const {
  str, parse, seq, many, oneOf, numbers, regex,
} = require('./index');

const parser = oneOf({
  parsers: [regex(/^\w*/), numbers(), str('shit')],
});

const tree = parse({ parser, input: 'nope this is pink' });

// console.log(JSON.stringify(tree));

console.log(util.inspect(tree, false, null, true /* enable colors */));
