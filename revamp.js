/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable strict */

'use strict';

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

  if (!error) {
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

// REGEX -----------------------------------------
const regex = (r, op) => parser((i) => {
  const result = global.input.slice(i).match(r);
  if (result) return { parsed: result[0] };
  return { error: `can not match regex at -> "${global.input.slice(i, i + 10)}..."` };
}, op);

const letters = (op) => regex(/^[a-z]+/, op);
const letter = (op) => regex(/^[a-z]/, op);
const number = (op = {}) => regex(/^[0-9]/, op);
const numbers = (op = {}) => regex(/^[0-9]+/, op);
const alphaNumeric = (op = {}) => regex(/^[a-zA-Z0-9]/, op);
const alphaNumerics = (op = {}) => regex(/^[a-zA-Z0-9]+/, op);
const oneWhitespace = (op = {}) => regex(/^[\s]/, op);
const whitespace = (op = {}) => regex(/^[\s]+/, op);
const optionalWhitespace = (op = {}) => regex(/^[\s]*/, op);

// MORE ------------------------------
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

// ----------------------------------------------------------------

parse(optionalWhitespace(), '     coolcoolcool23456');

module.exports = {
  str,
  regex,
  letter,
  letters,
  numbers,
  number,
  zeroOrMore,
  alphaNumeric,
  alphaNumerics,
  oneWhitespace,
  whitespace,
  optionalWhitespace,
  nOrMore,
};
