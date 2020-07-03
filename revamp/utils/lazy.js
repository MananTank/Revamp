const createParser = require('./createParser');

// thunk is a function that returns a parser
// ex: () => str('cool', { .. })

// takes a thunk ( that returns a parser )
// returns a parser with given parser from thunk as the logic
function lazy(thunk, op, info) {
  const logic = (state) => {
    const parser = thunk(); // calling thunk returns the parser
    return parser(state);
  };
  return createParser(logic, op, info);
}

module.exports = lazy;
