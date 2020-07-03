const createParser = require('../utils/createParser');
const seq = require('./seq');

function upTo(op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = op.parser({ ...state, index: i });
      // ✔️
      if (!newState.error) return { ...state, parsed, index: state.index + parsed.length };
      parsed += global.input[i];
      i++;
    }

    // ❌
    return {
      ...state,
      error: `end of input reached, but could not parse ${op.parser.parses} in upTo`,
    };
  };

  return createParser(logic, op, { type: 'upTo', parses: op.parser.parses });
}

function upToAnd(op) {
  return seq({
    parsers: [upTo(op), op.parser],
    revamp: (arr) => (op ? op(arr[0]) : arr[0]),
  });
}

module.exports = { upTo, upToAnd };
