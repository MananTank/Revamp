const createParser = require('../utils/createParser');

// parse anything in between op.left and op.right
function inBetween(op) {
  function logic(state) {
    // parse left
    const leftState = op.left(state);
    if (leftState.error) return leftState;

    // try and satisfy the right parser

    if (op.between) {
      // try to parse it
      const betweenState = op.between(leftState);
      if (betweenState.error) return betweenState;

      const rightState = op.right(betweenState);
      if (rightState.error) return rightState;
      // else send full parsed stuff
      return {
        left: leftState.parsed,
        between: betweenState.parsed,
        right: rightState.parsed,
      };
      // error if we can not
    }

    // else if no between is given
    let between = '';

    let i = leftState.index;
    while (i < global.input.length) {
      const rightState = op.right({ ...state, index: i });
      if (!rightState.error) {
        return {
          ...rightState,
          parsed: {
            left: leftState.parsed,
            between,
            right: rightState.parsed,
          },
          error: null,
        };
      }

      between += global.input[i++];
    }

    return {
      ...state,
      error: 'ERROR: in inBetween : End of input reached, but can not satisfy given parsers',
      parsed: {
        left: leftState.parsed,
      },
    };
  }

  return createParser(logic, op, {
    type: 'inBetween',
    parses: `left: ${op.left}, right: ${op.right}`,
  });
}

module.exports = inBetween;
