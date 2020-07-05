/* eslint-disable guard-for-in */
const createParser = require('../utils/createParser');

// a strict series throws strictError when it is not fully satisfied
// if not even the first parser is satisfied, then no criticle error is thrown, only simple error

function series(parsers, op = {}) {
  const totalParsers = Object.keys(parsers).length;

  function logic(state) {
    let newState = state;
    const parsed = {};
    let i = 0;

    for (const key in parsers) {
      const parser = parsers[key];
      newState = parser(newState);
      i++;

      // push the parsed (non null stuff only) stuff even if it has error
      if (key[0] !== '_') {
        if (newState.parsed) {
          parsed[key] = newState.parsed;
        }
      }

      // if a parser fails in series, stop parsing further
      if (newState.error) break;

      // if no error, parse sep if any and not after the last item
      if (op.sep && i !== totalParsers) {
        const { error, index } = op.sep(newState);
        newState.index = index;
        newState.error = error;
      }
    }

    const parsedParsers = Object.keys(parsed).length;
    // if some parsed but not all
    // and if series is strict
    // send error, nothnig parsed
    if (op.strict && parsedParsers > 0 && totalParsers !== parsedParsers) {
      return { ...newState, strictError: true, parsed: null };
    }

    // else
    // if all passed, return last parser's state with parsed value of parsed
    // if not all parsed, return last parser's state, with parsed value as parsed
    if (parsedParsers === 0) {
      return { ...newState, parsed: null };
    }
    return { ...newState, parsed };
  }

  return createParser(logic, op, { type: 'SERIES', parses: Object.keys(parsers) });
}

module.exports = series;
