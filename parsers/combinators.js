/* eslint-disable no-use-before-define */
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
          parsed: parsedArray,
          error: {
            ...newState.error,
            many: {
              min: op.min,
              executed: i,
            },
          },
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

function upToAnd(parser, op) {
  return seq({
    parsers: [upTo(parser), parser],
    revamp: (arr) => (op ? op(arr[0]) : arr[0]),
  });
}

// ----------------------------------------------
function seq(op) {
  // for debug mode
  const parserList = op.parsers.map((p) => p.parses).join(',');

  // keep parsing parsers till an error is encountered
  // return last state, with parsed value changed to array of parsed values
  function logic(state) {
    let newState = state;
    const parsedArray = [];

    for (const parser of op.parsers) {
      newState = parser(newState);
      // ❌ stop parsing further
      if (newState.error) break;
      parsedArray.push(newState.parsed);
    }

    // ✔️, ❌ return last parser's state, but change the parsed value to parsed array
    return { ...newState, parsed: parsedArray };
  }

  return createParser(logic, op, { type: 'seq', parses: `${parserList}` });
}

// parse anything in between op.left and op.right
function inBetween(op) {
  function logic(state) {
    // parse left
    const leftState = op.left(state);
    if (leftState.error) return leftState;

    // try and satisfy the right parser

    let parsed = '';

    let i = leftState.index;
    while (i < global.input.length) {
      const rightState = op.right({ ...state, index: i });
      if (!rightState.error) {
        return { ...rightState, parsed, error: null };
      }

      parsed += global.input[i++];
    }

    return {
      ...state,
      error: 'ERROR: in inBetween : End of input reached, but can not satisfy given parsers',
    };
  }

  return createParser(logic, op, {
    type: 'inBetween',
    parses: `left: ${op.left}, right: ${op.right}`,
  });
}

module.exports = {
  seq,
  many,
  oneOf,
  upTo,
  inBetween,
  upToAnd,
};
