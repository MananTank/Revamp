/* eslint-disable no-unused-vars */
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

function createParser(logic, options = {}, info) {
  function parser(state) {
    if (state.error) return state;
    const { error, parsed } = logic(state);
    let newIndex;

    if (Array.isArray(parsed)) {
      newIndex = parsed.join('').length;
    } else {
      newIndex = state.index + parsed.length;
    }

    if (!error) {
      const newState = Object.freeze({
        ...state,
        parsed: options.revamp ? options.revamp(parsed) : parsed,
        index: newIndex,
      });

      const nextParser = options.next && options.next(newState.parsed);
      return nextParser ? nextParser(newState) : newState;
    }
    return Object.freeze({ ...state, error });
  }

  parser.type = info.type;
  parser.parses = info.parses;
  return parser;
}

function str(s, op) {
  const logic = ({ index: i }) => {
    if (global.input.slice(i).startsWith(s)) return { parsed: s };
    return { error: `expected ${s}, got ${global.input.slice(i, i + s.length)}...` };
  };

  return createParser(logic, op, { type: 'string', parses: `"${s}"` });
}

function regex(rExp, op, parses) {
  const logic = ({ index: i }) => {
    const result = global.input.slice(i).match(rExp);
    if (result) return { parsed: result[0] };
    return { error: `can not match regex at -> "${global.input.slice(i, i + 10)}..."` };
  };

  return createParser(logic, op, { type: 'regex', parses });
}

const letters = (op) => regex(/^[a-z]+/, op, 'letters');
const letter = (op) => regex(/^[a-z]/, op, 'letter');
const number = (op) => regex(/^[0-9]/, op, 'number');
const numbers = (op) => regex(/^[0-9]+/, op, 'numbers');
const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');
const oneWhitespace = (op) => regex(/^[\s]/, op, 'one whitespace');
const whitespace = (op) => regex(/^[\s]+/, op, 'whitespace');
const optionalWhitespace = (op) => regex(/^[\s]*/, op, 'optional whitespace');

function zeroOrMore(parser, op) {
  const logic = (state) => {
    let newState = state;
    const parsed = [];
    while (true) {
      newState = parser(newState);
      if (newState.error) {
        return { parsed };
      }
      parsed.push(newState.parsed);
    }
  };
  return createParser(logic, op, { type: 'zeroOrMore', parses: parser.parses });
}

function nOrMore(n, parser, op) {
  const logic = (state) => {
    let newState = state;
    const parsed = [];
    let i = 0;
    while (true) {
      newState = parser(newState);
      if (newState.error) {
        if (i >= n) return { parsed };
        return {
          error: `expected ${parser.type} parser to to parse ${parser.target} ${n} or more times, but parsed ${i} times instead`,
        };
      }
      parsed[i++] = newState.parsed;
    }
  };

  return createParser(logic, op, { type: `${n} or more ${parser.type}`, parses: parser.parses });
}

function oneOf(parsers, op) {
  const parserList = parsers.map((p) => p.parses).join(', ');

  const logic = (state) => {
    let newState = state;

    for (const parser of parsers) {
      newState = parser(state);
      if (!newState.error) {
        return { parsed: newState.parsed };
      }
    }

    return { error: `none of [${parserList}] in oneOf parser could parse` };
  };

  return createParser(logic, op, {
    type: 'one of',
    parses: `one of [${parserList}]`,
  });
}

function upTo(parser, op) {
  const logic = (state) => {
    let i = state.index;
    let newState = state;
    let parsed = '';

    while (i < global.input.length) {
      newState = parser({ ...state, index: i });
      if (!newState.error) return { parsed };
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

function optional(parser, op = {}) {
  return (state) => {
    if (state.error) return state;
    const newState = parser(state);
    if (newState.error) return state;
    return { ...newState, parsed: op.revamp ? op.revamp(newState.parsed) : newState.parsed };
  };
}

function seq(parsers, op) {
  const parserList = parsers.map((p) => p.parses).join(', ');
  const logic = (state) => {
    let newState = state;
    const parsed = [];
    for (const parser of parsers) {
      newState = parser(newState);
      if (newState.error) {
        return {
          error: `Could not parse the sequence, failed at parsing : ${parser.parses} at index: ${newState.index}`,
        };
      }
      parsed.push(newState.parsed);
    }

    return { parsed };
  };

  return createParser(logic, op, { type: 'sequence', parses: `${parserList}` });
}

// ----------------------------------------------------------------

const coolShit = str('cool');

const parser = coolShit;

parse(parser, 'coolshit coolshitcoolcool23456');
