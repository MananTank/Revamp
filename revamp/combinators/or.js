const createParser = require('../utils/createParser');

// keep parsing till one of the parser is matching
function or(op) {
  const parserList = op.parsers.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;
    const totalParsers = op.parsers.length;
    let tempState;
    const parsed = [];
    let errors = []; // if no parser of or can pass anything, this will be all the errors

    let i = 0;
    while (i < totalParsers) {
      tempState = op.parsers[i++](newState);
      if (!tempState.error) {
        i = 0;
        newState = tempState;
        parsed.push(newState.parsed);
        errors = [];
      } else {
        errors.push(tempState.error);
      }
    }
    if (parsed.length) {
      return { ...newState, parsed };
    }
    return { ...newState, parsed: null, error: errors };
  };

  return createParser(logic, op, {
    type: 'or',
    parses: `[${parserList}]`,
  });
}

module.exports = or;
