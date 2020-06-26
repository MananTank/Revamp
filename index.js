const run = require('./utils/run');
const { str } = require('./parsers/string');
const seq = require('./combinators/sequence');
const { upTo, upToAnd } = require('./combinators/upTo');
const string = require('./parsers/string');

console.log('uptoand is ', upToAnd);

const css = `
.selector {
  display: flex;
  justify-content: center;
}`;

const selector = upToAnd(str('{')).map((s) => s.toUpperCase().trim());

const cssParser = seq([selector]);

const tree = run(cssParser, css);

console.log(tree);
