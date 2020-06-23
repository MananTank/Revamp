// update state in immutable way
// do not change the existing state, get new state and add changes in it

// update state with error
// override the state with error and hasError
function updateError({ state, error }) {
	return { ...state, error, hasError: true };
}

// update index and result
function updateResult({ state, parsed, index, map }) {
	return {
		...state,
		index,
		parsed: map ? map(parsed) : parsed,
	};
}

module.exports = {
	updateError,
	updateResult,
};
