const seq = require('./sequence');

function betweenOf(parser1, parser2) {
  return function betweenOfParser(contentParser) {
    return seq([parser1, contentParser, parser2]);
  };
}

function between(parser1, parser2) {
  return function betweenOfParser(contentParser) {
    return seq([parser1, contentParser, parser2]);
  };
}

module.exports = {
  betweenOf,
  between,
};
