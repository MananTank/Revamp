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

    function sepError(sepState, type) {
      sepState.error.type = type;
      sepState.parsed = parsed;
      return sepState;
    }

    // LEADING SEP
    if (op.sep && op.leading) {
      newState = op.sep(newState);
      if (newState.error) return sepError(newState, 'Wrong Leading Seperator');
    }

    for (const key in parsers) {
      const parser = parsers[key];
      newState = parser(newState);
      i++;

      // push the non-null parsed value of parser
      // it does not matter if parser has error or not
      // non-null parser values must always be saved
      if (newState.parsed !== null) {
        // auto filter feature of series
        // key names starting with _ is not pushed in the parsedObj
        if (key[0] !== '_') {
          parsed[key] = newState.parsed;
        }
      }

      // if parser has error, stop parsing others
      if (newState.error) break;

      // if sep is given
      // after runing parser, run sep parser
      // do not run sep parser after the last parser, if trailing is not allowed
      const lastParserRan = i === totalParsers;
      if (op.sep && !lastParserRan) {
        newState = op.sep(newState);
        if (newState.error) return sepError(newState, 'Wrong Seperator');
      }
    }

    // TRAILING SEP
    if (op.sep && op.trailing) {
      newState = op.sep(newState);
      if (newState.error) return sepError(newState, 'Wrong Trailing Seperator');
    }

    const parsedParsers = Object.keys(parsed).length;

    // for strict series, if not all the parsers in the series parsed, send strictError
    const seriesPartialyParsed = parsedParsers > 0 && totalParsers !== parsedParsers;
    if (op.strict && seriesPartialyParsed) {
      return { ...newState, strictError: true, parsed: null };
    }

    // if no parsers, parsed return null instead of emtpy object
    if (parsedParsers === 0) {
      return { ...newState, parsed: null };
    }

    // if parsed fully or parser non-strict series partially
    return { ...newState, parsed };
  }

  return createParser(logic, op, { type: 'SERIES', parses: Object.keys(parsers) });
}

module.exports = series;
