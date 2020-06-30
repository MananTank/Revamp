/* eslint-disable no-console */
const {
  str, parse, seq, many,
} = require('./index');

const parser = many(str('cool '), { min: 4 });

const tree = parse({ parser, input: 'cool cool cool cool shit' });

console.log(tree);
