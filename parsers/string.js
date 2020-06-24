const Parser = require('../classes/Parser');
const { matchString, matchRegex } = require('../utils/matching');

const string = new Parser(matchString);

const regex = (r, map) => new Parser(matchRegex(r))(map);

const letter = new Parser(matchRegex(/^[a-zA-Z]/));
const letters = new Parser(matchRegex(/^[a-zA-Z]*/));

const digit = new Parser(matchRegex(/^[0-9]/));
const digits = new Parser(matchRegex(/^[0-9]*/));

const alphaNumeric = new Parser(matchRegex(/^[a-zA-Z0-9]/));
const alphaNumerics = new Parser(matchRegex(/^[a-zA-Z0-9]*/));

const singleWhitespace = new Parser(matchRegex(/^[\s]/));
const whitespace = new Parser(matchRegex(/^[\s]*/));

module.exports = {
  string,
  letter,
  digit,
  letters,
  digits,
  whitespace,
  alphaNumeric,
  alphaNumerics,
  singleWhitespace,
  regex,
};
