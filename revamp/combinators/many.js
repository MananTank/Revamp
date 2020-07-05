const createParser = require('../utils/createParser');

function many(parser, op = {}) {
  // default min: 1
  op.min = op.min ? op.min : 1;

  function logic(state) {
    let newState = state;
    const parsedArray = [];
    let i = 0; // parser ran i times
    let trailingSep = false; // it is set when trailing sep is not found

    while (true) {
      // if ith parser passes, try and parser sep
      // by default trailing seperator is not allowed
      if (i !== 0 && op.sep) {
        newState = op.sep(newState);
        trailingSep = true;
      }

      // parse the ith parser
      newState = parser(newState);

      // if parser parsed something, even if it has error, push it
      // this is done so that all the parsed stuff does not go to waste and user can see how much is parsed and where the parsing stopped
      if (newState.parsed) {
        trailingSep = false;
        parsedArray[i++] = newState.parsed;
      }

      // if error or parser parsed nothing
      if (newState.error || newState.parsed === null) {
        // ✔️ stop parsing, no error
        // if parsed more than min and no strict errors
        if (i >= op.min && !newState.strictError) {
          if (!trailingSep || (trailingSep && op.allowTrailingSep)) {
            return { ...newState, parsed: parsedArray, error: null };
          }

          // error
          return {
            ...newState,
            parsed: parsedArray,
            error: {
              type: 'trailing seperator not allowed',
            },
          };
        }

        // ❌ else error
        return { ...newState, parsed: parsedArray };
      }
    }
  }

  return createParser(logic, op, { type: 'MANY', parses: parser.parses });
}

module.exports = many;
