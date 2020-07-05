const createParser = require('../utils/createParser');

function string(s, op) {
  function logic(state) {
    const { index } = state;
    let parsed = ''; // keep track of what parsed

    // match characters of input from index to stringing s
    for (let i = 0; i < s.length; i++) {
      const inputChar = global.input[index + i];
      parsed += inputChar;

      // fail ❌
      if (i + index > global.input.length - 1) {
        return {
          ...state,
          parsed: null,
          error: {
            type: 'unexpected end of input',
            parser: 'string',
            index: i,
          },
        };
      }

      // fail ❌
      if (inputChar !== s[i]) {
        return {
          ...state,
          parsed: null,
          error: {
            type: 'unexpected character',
            expected: s[i],
            got: inputChar,
            index: index + i,
            parser: 'string',
            parsing: s,
          },
        };
      }
    }

    // pass ✔️
    return {
      ...state,
      parsed,
      index: index + parsed.length,
    };
  }

  return createParser(logic, op, { type: 'STRING', parses: s });
}

module.exports = string;
