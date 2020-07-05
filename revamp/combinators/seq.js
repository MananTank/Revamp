/* eslint-disable guard-for-in */
const createParser = require('../utils/createParser');

// a strict seq throws strictError when it is not fully satisfied
// if not even the first parser is satisfied, then no criticle error is thrown, only simple error

function seq(parsersObj, op = {}) {
  const totalParsers = Object.keys(parsersObj).length;

  function logic(state) {
    let newState = state;
    const parsedObj = {};

    for (const key in parsersObj) {
      const parser = parsersObj[key];
      newState = parser(newState);
      // ❌ stop parsing further
      // do not send half parsed seq
      if (newState.error) break;

      if (key[0] !== '_') {
        parsedObj[key] = newState.parsed;
      }
    }

    // ✔️, ❌ return last parser's state, but change the parsed value to parsed array

    const parsedParsers = Object.keys(parsersObj).length;
    // if some parsed but not all
    if (op.strict && parsedParsers > 0 && totalParsers !== parsedParsers) {
      return { ...newState, strictError: true, parsed: parsersObj };
    }
    return { ...newState, parsed: parsedObj };
  }

  return createParser(logic, op, { type: 'seq', parses: parsersObj });
}

module.exports = seq;
