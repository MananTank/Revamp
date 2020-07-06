/* eslint-disable guard-for-in */
const createParser = require('../utils/createParser');

function oneOf(parsersObj, op) {
  // const parserList = parsersObj.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;
    const errors = {};

    for (const key in parsersObj) {
      const parser = parsersObj[key];
      newState = parser(state);
      // ✔️
      if (!newState.error) return newState;
      errors[key] = newState.error;
    }

    // ❌, if none of the parsersObj could parse
    return {
      ...state,
      error: {
        type: 'all the parsersObj failed given to oneOf()',
        errors,
      },
    };
  };

  return createParser(logic, op, {
    type: 'oneOf',
    parses: Object.keys(parsersObj),
  });
}

module.exports = oneOf;
