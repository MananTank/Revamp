// takes n number of parser in the arguments

const { updateResult } = require('../utils/state');

// returns a parser that can parse - what the given sequence of parsers can
function sequence(parsers, map) {
  const sequenceParser = function (state) {
    // do not parse, if the state already has error
    if (state.hasError) return state;

    // n parsers produce n parsed results
    // all parsed results that should be an array
    const parsed = [];

    let accumulatedState = state;

    for (parser of parsers) {
      accumulatedState = parser(accumulatedState);

      // if one of the parser in seq fails, break
      if (accumulatedState.hasError) break;
      else if (accumulatedState.parsed !== null) {
        parsed.push(accumulatedState.parsed);
      }
    }

    // accumulatedState will be the state of last failed one or last passed one
    // override the last parser's parsed value to an array of parsed values
    return updateResult({ state: accumulatedState, parsed, map });
  };

  return sequenceParser;
}

module.exports = sequence;
