const createParser = require('../utils/createParser');
const { matchString, matchRegex } = require('../utils/Matcher');

const str = createParser(matchString, true);

const regex = (r) => createParser(matchRegex(r));

const letter = createParser(matchRegex(/^[a-zA-Z]/));
const letters = createParser(matchRegex(/^[a-zA-Z]*/));

const digit = createParser(matchRegex(/^[0-9]/));
const digits = createParser(matchRegex(/^[0-9]*/));

const alphaNumeric = createParser(matchRegex(/^[a-zA-Z0-9]/));
const alphaNumerics = createParser(matchRegex(/^[a-zA-Z0-9]*/));

const singleWhitespace = createParser(matchRegex(/^[\s]/));
const whitespace = createParser(matchRegex(/^[\s]*/));

module.exports = {
  str,
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
