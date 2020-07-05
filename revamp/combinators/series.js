/* eslint-disable guard-for-in */
const createParser = require('../utils/createParser');

// a strict series throws strictError when it is not fully satisfied
// if not even the first parser is satisfied, then no criticle error is thrown, only simple error

function series(parsersObj, op = {}) {
  const totalParsers = Object.keys(parsersObj).length;

  function logic(state) {
    let newState = state;
    const parsedObj = {};

    for (const key in parsersObj) {
      const parser = parsersObj[key];
      newState = parser(newState);

      // if a parser fails in series, stop parsing further
      if (newState.error) break;

      // else, push the parsed into obj
      if (key[0] !== '_') {
        parsedObj[key] = newState.parsed;
      }
    }

    const parsedParsers = Object.keys(parsersObj).length;
    // if some parsed but not all
    // and if series is strict
    // send error, nothnig parsed
    if (op.strict && parsedParsers > 0 && totalParsers !== parsedParsers) {
      return { ...newState, strictError: true, parsed: null };
    }

    // else
    // if all passed, return last parser's state with parsed value of parsedObj
    // if not all parsed, return last parser's state, with parsed value as parsedObj
    return { ...newState, parsed: parsedObj };
  }

  return createParser(logic, op, { type: 'SERIES', parses: Object.keys(parsersObj) });
}

module.exports = series;
