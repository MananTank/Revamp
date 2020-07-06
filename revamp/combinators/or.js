const createParser = require('../utils/createParser');

// keep parsing till one of the parser is matching
function or(parsersObj, op) {
  const keys = Object.keys(parsersObj);
  const logic = (state) => {
    let newState = state;
    const totalParsers = keys.length;
    let tempState;
    let parsed = '';
    let errors = {}; // if no parser of or can pass anything, this will be all the errors

    let i = 0;
    while (i < totalParsers) {
      const parser = parsersObj[keys[i]];
      tempState = parser(newState);
      if (!tempState.error) {
        i = 0;
        newState = tempState;
        parsed += newState.parsed;
        errors = {};
      } else {
        errors[keys[i]] = tempState.error;
        i++;
      }
    }
    if (parsed.length) {
      return { ...newState, parsed };
    }
    return { ...newState, parsed: null, error: errors };
  };

  return createParser(logic, op, {
    type: 'or',
    parses: keys,
  });
}

module.exports = or;
