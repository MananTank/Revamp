/* eslint-disable no-console */
/* eslint-disable strict */

'use strict';

// a parser when sees a state that already has error, does not do anything and returns as it is
// so the state bubbles up to the end

/* eslint-disable no-shadow */
// const color = (c) => {
//   const reset = '\x1b[0m';
//   return {
//     yellow: `\x1b[33m%s${reset}`,
//     red: `\x1b[31m${reset}`,
//     blue: 'blue',
//   }[c];
// };

// const handleError = (fn) => (s, op) => {
//   if (!s) {
//     console.log('-----------------------------------------------');
//     console.error(`ERROR: ${fn.name}() called without first argument !`);
//     console.log('------------------------------------------------');
//     return null;
//   }
//   return fn(s, op);
// };

// const string = handleError(str);

const parse = (parser, input) => {
  global.input = input;
  const endState = parser({
    index: 0,
    parsed: null,
    error: null,
  });
  console.log(endState);
  global.input = null;
  return endState;
};

// PARSER ---------------
const parser = (logic, options = {}) => (state) => {
  if (state.error) return state;
  const { error, parsed } = logic(state.index);

  if (parsed) {
    const newState = Object.freeze({
      ...state,
      parsed: options.revamp ? options.revamp(parsed) : parsed,
      index: state.index + parsed.length,
    });

    const nextParser = options.next && options.next(newState.parsed);
    return nextParser ? nextParser(newState) : newState;
  }
  return Object.freeze({ ...state, error });
};

// STR: ---------------
const str = (s, op) => {
  const strParser = parser((i) => {
    if (global.input.slice(i).startsWith(s)) return { parsed: s };
    return { error: `expected ${s}, got ${global.input.slice(i, i + s.length)}...` };
  }, op);

  strParser.type = 'string';
  strParser.target = `"${s}"`;
  return strParser;
};

// REGEX: ---------------
const regex = (r, op) => parser((i) => {
  const result = global.input.slice(i).match(r);
  if (result && result[0]) return { parsed: result[0] };
  return { error: `can not match regex at -> "${global.input.slice(i, i + 10)}..."` };
}, op);

// regex based parsers
const letters = (op) => regex(/^[a-z]+/, op);
const letter = (op) => regex(/^[a-z]/, op);
const number = (op = {}) => regex(/^[0-9]/, op);
const numbers = (op = {}) => regex(/^[0-9]+/, op);

// x or more times
const zeroOrMore = (parser, op = {}) => (state) => {
  if (state.error) return state;
  let newState = state;
  let parsed = [];
  while (true) {
    newState = parser(newState);
    if (newState.error) {
      parsed = op.revamp ? op.revamp(parsed) : parsed;
      return { ...newState, parsed, error: null };
    }
    parsed.push(newState.parsed);
  }
};

const nOrMore = (n, parser, op = {}) => (state) => {
  if (state.error) return state;
  let newState = state;
  let parsed = [];
  let i = 0;
  while (true) {
    newState = parser(newState);
    if (newState.error) {
      if (i >= n) {
        parsed = op.revamp ? op.revamp(parsed) : parsed;
        return { ...newState, parsed, error: null };
      }
      return {
        ...state,
        error: `expected ${parser.type} parser to to parse ${parser.target} ${n} or more times, but parsed ${i} times instead`,
      };
    }

    parsed[i++] = newState.parsed;
  }
};

parse(nOrMore(4, str('cool')), 'coolcoolcool23456');

module.exports = {
  str,
  regex,
  letter,
  letters,
  numbers,
  number,
};
