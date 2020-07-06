// combinators
const inBetween = require('./combinators/inBetween');
const many = require('./combinators/many');
const oneOf = require('./combinators/oneOf');
const or = require('./combinators/or');
const series = require('./combinators/series');
const not = require('./combinators/not');
const { upTo, upToAnd } = require('./combinators/upTo');

// parsers
const string = require('./parsers/string');
const regex = require('./parsers/regex');
const others = require('./parsers/others');

// utils
const lazy = require('./utils/lazy');
const parse = require('./utils/parse');
const createParser = require('./utils/createParser');

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
