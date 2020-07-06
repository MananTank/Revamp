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
      return {
        ...state,
        error: {
          type: 'end of input reached',
        },
      };
    }

    // apply logic, get new state
    const newState = logic(state);

    // after this state and op is modified
    if (op.modify) {
      op.modify({ state: newState, op });
    }

    // ✔️ if no error in new state
    if (!newState.error) {
      const revampedNewState = {
        ...newState,
        parsed: op.revamp ? op.revamp(newState.parsed) : newState.parsed,
      };

      // ✔️ return new state
      // or run next parser and then return, it's new state
      const nextParser = op.next && op.next(revampedNewState.parsed);
      return nextParser ? nextParser(revampedNewState) : revampedNewState;
    }

    // ✔️ could not parse, but was optional, return the parser null
    if (op.optional) return { ...state, parsed: null };

    // ❌ parsing error
    if (op.strict) {
      return { ...newState, strictError: true };
    }

    // ❌
    return newState;
  }

  // apply info to parser for better dev experience
  parser.type = info.type;
  parser.parses = info.parses;

  // return parser;
  // extra wrapper for debugging
  return (state) => {
    const newState = parser(state);
    debug(newState, info, op);
    return newState;
  };
}

function debug(state, info, op) {
  if ((!op.nolog && global.debugMode) || (op && op.log)) {
    console.log('\n\n');
    console.log(info.type, ':', info.parses);
    console.log('--------------------------------');
    console.log(state);
    if (op.strict) {
      console.log('(STRICT)');
    }
  }
}

module.exports = createParser;
