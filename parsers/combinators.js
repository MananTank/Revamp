const createParser = require('./createParser');

// run parser op.min or more times
function many(parser, op = {}) {
  // default min is set to 1
  op.min = op.min ? op.min : 1;

  function logic(state) {
    let newState = state;
    const parsedArray = [];
    let i = 0; // parser ran i times

    while (true) {
      newState = parser(newState);

      // if error
      if (newState.error || newState.parsed === '') {
        // ✔️ no error if parser ran more than op.min times, no error
        if (i >= op.min) return { ...newState, parsed: parsedArray, error: null };

        // ❌ else error
        return {
          ...newState,
          error: `expected ${parser.type} parser to to parse ${parser.target} ${op.min} or more times, but parsed ${i} times instead`,
        };
      }

      // if no error, push it parsed array

      parsedArray[i++] = newState.parsed;
    }
  }

  return createParser(logic, op, { type: `many {min:${op.min}}`, parses: parser.parses });
}

// ---------------------------------

function oneOf(op) {
  const parserList = op.parsers.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;

    for (const parser of op.parsers) {
      newState = parser(state);
      // ✔️
      if (!newState.error) return newState;
    }

    // ❌
    return { ...state, error: `none of [${parserList}] in oneOf parser could parse` };
  };

  return createParser(logic, op, {
    type: 'oneOf',
    parses: `[${parserList}]`,
  });
}

// -------------------------------------------------
function upTo(parser, op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = parser({ ...state, index: i });
      // ✔️
      if (!newState.error) return { ...state, parsed, index: parsed.length };
      parsed += global.input[i];
      i++;
    }

    // ❌
    return {
      ...state,
      error: `end of input reached, but could not parse ${parser.parses} in upTo`,
    };
  };

  return createParser(logic, op, { type: 'upTo', parses: parser.parses });
}

function seq(op) {
  const parserList = op.parsers.map((p) => p.parses).join(',');
  const logic = (state) => {
    let newState = state;
    const parsedArray = [];

    for (const parser of op.parsers) {
      newState = parser(newState);

      // ❌ return the error state of parser that failed
      if (newState.error) {
        return { ...newState, error: `ERROR in seq : ${newState.error}` };
      }
      parsedArray.push(newState.parsed);
    }

    // ✔️ replace last parser's parsed value to parsed array
    return { ...newState, parsed: parsedArray };
  };

  return createParser(logic, op, { type: 'seq', parses: `${parserList}` });
}

module.exports = {
  seq,
  many,
  oneOf,
  upTo,
};
