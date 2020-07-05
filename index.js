// combinators
const inBetween = require('./revamp/combinators/inBetween');
const many = require('./revamp/combinators/many');
const oneOf = require('./revamp/combinators/oneOf');
const or = require('./revamp/combinators/or');
const series = require('./revamp/combinators/series');
const not = require('./revamp/combinators/not');
const { upTo, upToAnd } = require('./revamp/combinators/upTo');

// parsers
const string = require('./revamp/parsers/string');
const regex = require('./revamp/parsers/regex');
const others = require('./revamp/parsers/others');

// utils
const lazy = require('./revamp/utils/lazy');
const parse = require('./revamp/utils/parse');
const createParser = require('./revamp/utils/createParser');

module.exports = {
  createParser,
  string,
  regex,
  ...others,
  lazy,
  parse,
  inBetween,
  many,
  oneOf,
  upTo,
  upToAnd,
  series,
  or,
  not,
};
