const createParser = require('../utils/createParser');

function many(parser, op = {}) {
  // default min: 1
  op.min = op.min ? op.min : 1;

  function logic(state) {
    let newState = state;
    const parsedArray = [];
    let i = 0;

    while (true) {
      // do not run sep parser before first parser
      if (i !== 0 && op.sep) {
        const sepState = op.sep(newState);

        // if sep failed
        if (sepState.error) {
          const nextState = parser(newState);
          // if parser failed
          if (nextState.error) {
            newState = sepState;
          } else {
            // missing sep
            newState.error.type = 'Missing or Wrong Seperator';
            return newState;
          }
        } else {
          // sep passed
          const nextState = parser(sepState);
          // try parsing parser after it
          // if we can not, it means this sep is trailing sep and do not parse it
          if (!nextState.error) {
            newState = sepState;
          }
        }
      }

      newState = parser(newState);

      // push non-null parser value of the parser, even if the parser may or may not have error

      if (newState.parsed !== null) {
        parsedArray[i++] = newState.parsed;
      }

      // if error or parser parsed nothing
      // stop iteration
      if (newState.error || newState.parsed === null) {
        // if parsed more than min and no strict errors
        if (i >= op.min && !newState.strictError) {
          // pass
          return { ...newState, parsed: parsedArray, error: null };
        }

        // if can not be parsed more than min times
        return { ...newState, parsed: parsedArray };
      }
    }
  }

  return createParser(logic, op, { type: 'MANY', parses: parser.parses });
}

module.exports = many;
