const { many } = require('./combinators');
const createParser = require('./createParser');

function str(s, op) {
  function logic(state) {
    const { index } = state;
    let parsed = ''; // keep track of what parsed

    // match characters of input from index to string s
    for (let i = 0; i < s.length; i++) {
      const inputChar = global.input[index + i];
      parsed += inputChar;

      // fail ❌
      if (inputChar !== s[i]) {
        return { error: `expected "${s}", got "${parsed}" instead at index: ${index + i}` };
      }
    }

    // pass ✔️
    return {
      ...state,
      parsed,
      index: index + parsed.length,
    };
  }

  return createParser(logic, op, { type: 'basic', parses: `"${s}"` });
}

function regex(rExp, op, parses) {
  const logic = (state) => {
    const { index } = state;
    const result = global.input.slice(index).match(rExp);
    // pass ✔️
    if (result) return { ...state, parsed: result[0], index: index + result[0].length };
    // fail ❌
    return {
      ...state,
      error: `can not match regex at -> "${global.input.slice(index, index + 10)}..."`,
    };
  };

  return createParser(logic, op, { type: 'regex()', parses });
}

const letters = (op) => regex(/^[a-z]+/, op, 'letters');
const letter = (op) => regex(/^[a-z]/, op, 'letter');
const number = (op) => regex(/^[0-9]/, op, 'number');
const numbers = (op) => regex(/^[0-9]+/, op, 'numbers');
const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');
const singleWhitespace = (op) => regex(/^[\s]/, op, 'one whitespace');

// default 1 or more
// use op.min to set to x or more
const whitespace = (op) => many(singleWhitespace(), op);

module.exports = {
  str,
  regex,
  letter,
  letters,
  number,
  numbers,
  alphaNumeric,
  alphaNumerics,
  singleWhitespace,
  whitespace,
};
