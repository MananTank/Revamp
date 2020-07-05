const createParser = require('../utils/createParser');

function many(parser, op = {}) {
  // default min: 1
  op.min = op.min ? op.min : 1;

  function logic(state) {
    let newState = state;
    const parsedArray = [];
    let i = 0; // parser ran i times

    while (true) {
      // parse the ith parser
      newState = parser(newState);

      // if ith parser passes, try and parser sep
      if (!newState.error && op.sep) {
        const { index, error } = op.sep(newState);
        newState.index = index;
        newState.error = error;
      }

      // if parser parsed something, even if it has error, push it
      // this is done so that all the parsed stuff does not go to waste and user can see how much is parsed and where the parsing stopped
      if (newState.parsed) {
        parsedArray[i++] = newState.parsed;
      }

      // if error or parser parsed nothing
      if (newState.error || newState.parsed === null) {
        // ✔️ stop parsing, no error
        // if parsed more than min and no strict errors
        if (i >= op.min && !newState.strictError) {
          return { ...newState, parsed: parsedArray, error: null }; // last sep error or parser error is ignored
        }

        // ❌ else error
        return { ...newState, parsed: parsedArray };
      }
    }
  }

  return createParser(logic, op, { type: 'MANY', parses: parser.parses });
}

module.exports = many;
