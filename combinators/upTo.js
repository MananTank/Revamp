const seq = require('./sequence');

const { updateResult, updateError } = require('../utils/state');

// keep consuming till the given parser is able to parse
function upTo(parser) {
  // if (map === undefined) return null;
  function upToParser(state, map) {
    let newState;
    let parsed = '';
    let i = 0;
    do {
      newState = parser({ ...state, index: state.index + i });
      // console.log(i, global.input[state.index + i]);

      if (!newState.hasError) {
        // since we no that at index+i parser matches, return index+i-1
        // because we do not want to consume the target, we only want to go upto that target
        // convert array to string

        return updateResult({
          state: newState,
          index: state.index + i,
          parsed,
          map,
        });
      }

      if (newState.index === global.input.length) {
        return updateError({
          state,
          error: 'can not satisfy upTo parser, reached at the end of input',
        });
      }

      // if parser is not able to parse
      // increment index, and run the parser again with initial state with index increased
      parsed += global.input[newState.index];

      i += 1;
    } while (true);
  }

  return attachMap(upToParser);
}

function upToAnd(parser, map) {
  const x = seq([upTo(parser), parser], (arr) => (map ? map(arr.join('')) : arr.join('')));
  return attachMap(x);
}

module.exports = {
  upTo,
  upToAnd,
};
