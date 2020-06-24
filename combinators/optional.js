const { updateResult } = require('../utils/state');

// do not set error and update if the parser fails
// only update the state is the parser passes
function optional(parser) {
  return function (state) {
    const newState = parser(state);
    if (newState.hasError) {
      return state;
    }
    return updateResult({ state: newState });
  };
}

module.exports = optional;
