const createParser = require('../utils/createParser');

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

module.exports = seq;
