/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable strict */

'use strict';

const parse = ({ parser, input, debugMode }) => {
  global.input = input;
  global.debugMode = debugMode;

  const endState = parser({
    index: 0,
    parsed: null,
    error: null,
  });

  // console.log('FINAL STATE: ');
  // console.log('----------------------------------------');
  // console.log(endState);

  global.debugMode = null;
  global.input = null;
  return endState;
};

function createParser(logic, op = {}, info) {
  // if (!info) {
  //   info = {};
  //   info.type = 'no-type';
  //   info.parses = 'no-parses';
  // }

  function parser(state) {
    if (state.error) return state;
    if (state.index > global.input.length - 1) {
      if (op.optional) {
        return { ...state, parsed: '' };
      }
      return { ...state, error: 'end of input reached' };
    }
    const logicOut = logic(state);
    const { error, parsed, index } = logicOut;
    // console.log(logicOut);

    if (!error) {
      const newState = Object.freeze({
        ...state,
        parsed: op.revamp ? op.revamp(parsed) : parsed,
        index,
      });

      if (global.debugMode) {
        // eslint-disable-next-line no-console
        // console.log(info.type, 'parsing : ', info.parses);
        // eslint-disable-next-line no-console
        // console.log(newState);
        // eslint-disable-next-line no-console
        console.log('----------------------------------------------------------');
      }
      const nextParser = op.next && op.next(newState.parsed);
      return nextParser ? nextParser(newState) : newState;
    }

    if (op.optional) {
      // console.log('it was optional');
      return { ...state, parsed: '' };
    }

    return Object.freeze({ ...state, error });
  }

  if (info) {
    parser.type = info.type;
    parser.parses = info.parses;
  }

  return parser;
}

// _________________________________________________________
function str(s, op) {
  let got = '';
  const logic = ({ index }) => {
    for (let i = 0; i < s.length; i++) {
      got += global.input[i];
      if (global.input[i + index] !== s[i]) {
        return { error: `expected "${s}", got "${got}" instead at index: ${index + i}` };
      }
    }
    return { parsed: s, index: index + s.length };
  };
  return createParser(logic, op, { type: 'str()', parses: `"${s}"` });
}

function regex(rExp, op, parses) {
  const logic = ({ index }) => {
    const result = global.input.slice(index).match(rExp);
    if (result) return { parsed: result[0], index: index + result[0].length };
    return { error: `can not match regex at -> "${global.input.slice(index, index + 10)}..."` };
  };

  return createParser(logic, op, { type: 'regex()', parses });
}

const letters = (op) => regex(/^[a-z]+/, op, 'letters');
const letter = (op) => regex(/^[a-z]/, op, 'letter');
const number = (op) => regex(/^[0-9]/, op, 'number');
const numbers = (op) => regex(/^[0-9]+/, op, 'numbers');
const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');
const oneWhitespace = (op) => regex(/^[\s]/, op, 'one whitespace');
const whitespace = (op) => regex(/^[\s]+/, op, 'whitespace');

function many(parser, op = {}) {
  op.min = op.min ? op.min : 0;

  const logic = (state) => {
    let newState = state;
    const parsed = [];
    let i = 0;

    while (true) {
      newState = parser(newState);

      if (newState.error) {
        if (i >= op.min) return { parsed, index: newState.index };
        return {
          error: `expected ${parser.type} parser to to parse ${parser.target} ${op.min} or more times, but parsed ${i} times instead`,
        };
      }

      parsed[i++] = newState.parsed;
    }
  };

  return createParser(logic, op, { type: `many({min: ${op.min}})`, parses: parser.parses });
}

function oneOf(op) {
  const parserList = op.parsers.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;

    for (const parser of op.parsers) {
      newState = parser(state);
      if (!newState.error) {
        return { parsed: newState.parsed, index: newState.index };
      }
    }

    return { error: `none of [${parserList}] in oneOf parser could parse` };
  };

  return createParser(logic, op, {
    type: 'oneOf',
    parses: `[${parserList}]`,
  });
}

function upTo(parser, op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = parser({ ...state, index: i });
      if (!newState.error) return { parsed, index: parsed.length };
      parsed += global.input[i];
      i++;
    }

    return {
      ...state,
      error: `end of input reached, but could not parse ${parser.parses} in upTo`,
    };
  };

  return createParser(logic, op, { type: 'upTo', parses: parser.parses });
}

function seq(op) {
  const parserList = op.parsers.map((p) => p.parses).join(' , ');
  const logic = (state) => {
    let newState = state;
    const parsed = [];

    for (const parser of op.parsers) {
      newState = parser(newState);

      if (newState.error) {
        return {
          error: `seq() of [ ${parserList} ] failed at parsing : ${parser.parses} at index: ${newState.index}`,
        };
      }
      parsed.push(newState.parsed);
    }

    return { parsed, index: newState.index };
  };

  return createParser(logic, op, { type: 'seq()', parses: `${parserList}` });
}

// ----------------------------------------------------------------
const numberComma = seq({
  parsers: [numbers(), whitespace({ optional: true }), str(','), whitespace({ optional: true })],
  revamp: (arr) => arr[0],
});

const ast = parse({
  parser: many(numberComma),
  debugMode: true,
  input: '1, 2  , 3   4  ,   5',
});

console.log(ast);
