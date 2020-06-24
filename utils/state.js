// update state in immutable way
// do not change the existing state, get new state and add changes in it

// update state with error
// override the state with error and hasError
function updateError({ state, error }) {
  return { ...state, error, hasError: true };
}

// update index and result
function updateResult({
  state, parsed, index, map,
}) {
  const newState = { ...state };
  if (parsed) {
    newState.parsed = map ? map(parsed) : parsed;
  }

  if (index) {
    newState.index = index;
  }

  return newState;
}

module.exports = {
  updateError,
  updateResult,
};
