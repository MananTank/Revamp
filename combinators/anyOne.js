const { updateError, updateResult } = require('../utils/state.js');

// run any one of the parser
function anyOne(parsers, map) {
  return function anyOneParser(state) {
    if (state.hasError) return state;
    let newState = state;
    let parser;

    for (parser of parsers) {
      newState = parser(state);

      // if at least one parser is able to parse, success
      if (!newState.hasError) {
        return updateResult({ state: newState, map });
      }
    }

    // if all fail, failure
    return updateError({
      state,
      error: `None of the parser ran at index:${newState.index}`,
    });
  };
}

module.exports = anyOne;
