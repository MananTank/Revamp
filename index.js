const run = require('./utils/run');
const ignore = require('./utils/ignore');
const { string, whitespace, digits } = require('./parsers/string');
const { zeroOrMore } = require('./combinators/more');
const debug = require('./combinators/debug');
const seq = require('./combinators/sequence');
const { letters } = require('./parsers/string');

// string:hello
// number:42

// [
//    {
//       type: string,
//       value: 'hello'
//    },
//    {
//       type: number,
//       value: 42
//    }
// ]

const parser = debug(seq([letters(), digits()]));

const tree = run(parser, 'cooladfasfdasdf123hello');

console.log('tree', tree);
