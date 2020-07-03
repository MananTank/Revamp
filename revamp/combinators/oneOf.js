const createParser = require('../utils/createParser');

function oneOf(op) {
  const parserList = op.parsers.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;
    const errors = [];

    for (const parser of op.parsers) {
      newState = parser(state);
      // ✔️
      if (!newState.error) return newState;
      errors.push(newState.error);
    }

    // ❌, if none of the parsers could parse
    return {
      ...state,
      error: {
        type: 'all the parsers failed given to oneOf()',
        errors,
      },
    };
  };

  return createParser(logic, op, {
    type: 'oneOf',
    parses: `[${parserList}]`,
  });
}

module.exports = oneOf;
