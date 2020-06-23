const { updateError, updateResult } = require('../utils/state.js');

function or(parsers, map) {
	const orParser = function (state) {
		if (state.hasError) return state;
		let newState = state;
		for (parser of parsers) {
			newState = parser(newState);

			// if at least one parser is able to parse, success
			if (!newState.hasError) {
				return updateResult({ state: newState, map });
			}
		}

		// if all fail, failure
		return updateError({ state, error: `None of the parser in or ran at index:${newState.index}` });
	};

	return orParser;
}

module.exports = or;
