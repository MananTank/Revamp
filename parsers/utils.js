const util = require('util');
const createParser = require('./createParser');
// parse starts the parsing by calling the outermost parser with initial state
// input and other settings are saved in global
function parse({
  parser, input, debugMode, stepper, log,
}) {
  // set
  global.input = input;
  global.debugMode = debugMode;
  global.stepper = stepper;

  const initialState = {
    index: 0,
    parsed: null,
    error: null,
  };

  const endState = parser(initialState);

  if (log) {
    console.log(util.inspect(endState, false, null, true /* enable colors */));
  }

  // reset
  global.debugMode = null;
  global.input = null;
  global.stepper = null;
  return endState;
}

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

module.exports = {
  lazy,
  parse,
};
