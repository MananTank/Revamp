const createParser = require('./parsers/createParser');
const combinators = require('./parsers/combinators');
const basic = require('./parsers/basic');
const utils = require('./parsers/utils');

module.exports = {
  createParser,
  ...combinators,
  ...basic,
  ...utils,
};
