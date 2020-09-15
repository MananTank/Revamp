const createParser = require('../utils/createParser');
const seq = require('./series');

function upTo(parser, op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = parser({ ...state, index: i });
      // ✔️
      if (!newState.error) return { ...state, parsed, index: state.index + parsed.length };
      parsed += global.input[i];
      i++;
    }

    // ❌
    return {
      ...state,
      error: `end of input reached, but could not parse ${parser.parses} in upTo`,
    };
  };

  return createParser(logic, op, { type: 'upTo', parses: parser.parses });
}

function upToAnd(op) {
  return seq({
    parsers: [upTo(op), parser],
    revamp: (arr) => (op ? op(arr[0]) : arr[0]),
  });
}

module.exports = { upTo, upToAnd };
