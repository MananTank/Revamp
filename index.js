const run = require('./utils/run');
// const ignore = require('./utils/ignore');
const { exact, letter, letters, digits, digit } = require('./parsers/string');
// const { whitespace } = require('./parsers/string');
const seq = require('./combinators/sequence');
// const { product } = require('prelude-ls');
// const or = require('./combinators/or');

const { nOrMore, zeroOrMore, oneOrMore } = require('./combinators/more');

// const cools = oneOrMore(exact('cool'));

// const parser = seq([cools, letters()]);

const tree = run(letters(), 'coolthis is some string');

console.clear();

console.log('---------------');
console.log(tree);
console.log('---------------');
