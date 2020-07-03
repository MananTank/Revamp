const util = require('util');

// parse starts the parsing by calling the outermost parser with initial state
// input and other settings are saved in global
function parse({
  parser, input, debugMode, log,
}) {
  // set
  global.input = input;
  global.debugMode = debugMode;

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
  return endState;
}

module.exports = parse;
