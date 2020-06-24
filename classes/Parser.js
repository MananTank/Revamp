const Matcher = require('./Matcher');
const { updateError, updateResult } = require('../utils/state');

class Parser {
  constructor(matchLogic) {
    this.matchLogic = matchLogic;
    const matcher = new Matcher(matchLogic);

    return function parserGen(str, map) {
      return function strParser(state) {
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
      };
    };
  }
}

module.exports = Parser;
