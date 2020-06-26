const { Matcher } = require('./Matcher.js');
const { updateError, updateResult } = require('./state');

function createParser(logic, usesString = false) {
  const matcher = new Matcher(logic);

  function makeParser(str) {
    function parser(state, map) {
      const { index, hasError } = state;

      if (hasError) return state;

      let status;
      if (str) {
        status = matcher.match(str, index);
      } else {
        status = matcher.match(index);
      }

      // handle EOI
      if (status.eoi) {
        return updateError({
          state,
          error: `unexpected end of input, when trying to match string: "${str}" at index ${index}`,
        });
      }

      // if parsed successfully
      if (status.consumed) {
        // console.log('------------');

        // Parser.map(status.matched);
        return updateResult({
          state,
          index: status.unConsumedIndex,
          parsed: status.matched,
          map,
        });
      }

      // if parsing failed
      let error;
      if (str) {
        const got = global.input.substr(index, index + str.length);
        error = `expected "${str}", got "${got}" instead. ( error at index:${status.unConsumedIndex} )`;
      } else {
        error = `not expected:"${global.input[index]}"`;
      }

      return updateError({ state, error });
    }

    parser.map = (mapFn) => (state) => parser(state, mapFn);

    return parser;
  }

  if (!usesString) {
    return makeParser();
  }
  return makeParser;
}

module.exports = createParser;
