/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

// state is a freezed object to prevent any accidental mutation

function createParser(logic, op = {}, info = { type: 'NA', parses: 'NA' }) {
  function parser(state) {
    // stop all further processing if state has error
    if (state.error) return state;

    // if index is beyond input's length
    if (state.index > global.input.length - 1) {
      // ✔️ if the parser is optional no error
      if (op.optional) return { ...state, parsed: null };
      // ❌ else, EOI error
      return { ...state, error: 'end of input reached' };
    }

    // apply logic, get new state
    const { error, parsed, index } = logic(state);

    // if no error in new state
    if (!error) {
      // apply revamp if any
      const newState = Object.freeze({
        ...state,
        parsed: op.revamp ? op.revamp(parsed) : parsed,
        index,
      });

      // see what happens after the parser parses the given parser
      if (op.lookAhead) {
        op.lookAhead(newState, op);
      }

      // log when debug mode is on
      debug(newState, info);

      // ✔️ return new state
      // or run next parser and then return, it's new state
      const nextParser = op.next && op.next(newState.parsed);
      return nextParser ? nextParser(newState) : newState;
    }

    // see what happens after the parser parses the given parser
    if (op.lookAhead) {
      op.lookAhead({ ...state, error }, op);
    }
    console.log('op is', op);

    // ✔️ if parser could not parser but was optional, no error
    if (op.optional) return { ...state, parsed: null };

    // ❌ parsing error
    return Object.freeze({ ...state, error });
  }

  // apply info to parser for better dev experience
  parser.type = info.type;
  parser.parses = info.parses;

  return parser;
}

function debug(state, info) {
  if (global.debugMode) {
    console.log(info.type, '|', info.parses);
    console.log(state);
    console.log('\n');
  }
}

module.exports = createParser;
