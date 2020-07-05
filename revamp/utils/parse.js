const util = require('util');

// parse starts the parsing by calling the outermost parser with initial state
// input and other settings are saved in global
function parse(op) {
  const {
    parser, input, debugMode, log,
  } = op;
  // set
  global.input = input;
  global.debugMode = debugMode;

  const initialState = {
    parsed: null,
    error: null,
    index: 0,
  };

  if (debugMode) {
    console.log('===============================================================\n\n');
  }
  const endState = parser(initialState);

  if (debugMode) {
    console.log('===============================================================\n\n');
  }
  if (log) {
    console.log(util.inspect(endState, false, null, true /* enable colors */));
  }

  // reset
  global.debugMode = null;
  global.input = null;
  return endState;
}

module.exports = parse;
