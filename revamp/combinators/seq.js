const createParser = require('../utils/createParser');

// a strict seq throws strictError when it is not fully satisfied
// if not even the first parser is satisfied, then no criticle error is thrown, only simple error

function seq(parsers, op = {}) {
  // for debug mode
  const parserList = parsers.map((p) => p.parses).join(',');

  // keep parsing parsers till an error is encountered
  // return last state, with parsed value changed to array of parsed values
  function logic(state) {
    let newState = state;
    const parsedArray = [];

    for (const parser of parsers) {
      newState = parser(newState);
      // ❌ stop parsing further
      // do not send half parsed seq
      if (newState.error) return { ...newState, parsed: null };
      parsedArray.push(newState.parsed);
    }

    // ✔️, ❌ return last parser's state, but change the parsed value to parsed array

    // if some parsed but not all
    if (op.strict && parsedArray.length > 0 && parsedArray.length !== parsers.length) {
      console.log('seq not fully satisfied: ', parsedArray);
      return { ...newState, strictError: true, parsed: parsedArray };
    }
    return { ...newState, parsed: parsedArray };
  }

  return createParser(logic, op, { type: 'seq', parses: `${parserList}` });
}

module.exports = seq;
