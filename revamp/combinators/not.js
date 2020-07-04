const createParser = require('../utils/createParser');

// parse till given parser throws error
function not(op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = op.parser({ ...state, index: i });
      if (!newState.error) break;
      parsed += global.input[i];
      i++;
    }
    if (parsed) {
      return { ...state, parsed, index: state.index + parsed.length };
    }

    return { ...state, error: 'not parser failed' };
  };

  return createParser(logic, op, { type: 'upTo', parses: op.parser.parses });
}

module.exports = not;
