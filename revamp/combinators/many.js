const createParser = require('../utils/createParser');

function many(parser, op = {}) {
  // default min: 1
  op.min = op.min ? op.min : 1;

  function logic(state) {
    let newState = state;
    const parsedArray = [];
    let i = 0; // parser ran i times

    while (true) {
      newState = parser(newState);

      if (op.seperator) {
        const { index, error } = op.seperator(newState);
        newState.index = index;
        newState.error = error;
      }

      // if parser parsed something, even if it has error, push it
      if (newState.parsed) {
        parsedArray[i++] = newState.parsed;
      }

      // if error or parser parsed nothing
      if (newState.error || newState.parsed === null) {
        // ✔️ stop parsing, no error
        // if parsed more than min and no strict errors
        if (i >= op.min && !newState.strictError) {
          return { ...newState, parsed: parsedArray, error: null };
        }

        // ❌ else error
        return { ...newState, parsed: parsedArray };
      }
    }
  }

  return createParser(logic, op, { type: 'MANY', parses: parser.parses });
}

module.exports = many;
