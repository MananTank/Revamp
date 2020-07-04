// combinators
const inBetween = require('./revamp/combinators/inBetween');
const many = require('./revamp/combinators/many');
const oneOf = require('./revamp/combinators/oneOf');
const or = require('./revamp/combinators/or');
const seq = require('./revamp/combinators/seq');
const not = require('./revamp/combinators/not');
const { upTo, upToAnd } = require('./revamp/combinators/upTo');

// parsers
const str = require('./revamp/parsers/str');
const regex = require('./revamp/parsers/regex');
const others = require('./revamp/parsers/others');

// utils
const lazy = require('./revamp/utils/lazy');
const parse = require('./revamp/utils/parse');
const createParser = require('./revamp/utils/createParser');

module.exports = {
  createParser,
  str,
  regex,
  ...others,
  lazy,
  parse,
  inBetween,
  many,
  oneOf,
  upTo,
  upToAnd,
  seq,
  or,
  not,
};
