// run the parser n or more times till parser failes
// if the parser runs atleast n times -> success

const { updateError, updateResult } = require('../utils/state');

function nOrMore(n, parser, map) {
	const nOrMoreParser = function (state) {
		if (state.hasError) return state;
		let i = 0; // times parser ran
		let newState = state;
		let parsed = [];

		while (1) {
			newState = parser(newState);
			if (newState.hasError) break;
			parsed.push(newState.parsed);
			i++;
		}

		// failure
		if (i < n) {
			console.log(i);
			return updateError({
				newState,
				error: `expected the parser to run ${n} or more times but, ran only ${i} times instead`,
			});
		} else {
			// make sure that no error from running the last time which parser failed does not bubble up
			return updateResult({ state: { ...newState, hasError: false, error: null }, parsed, map });
		}
	};

	return nOrMoreParser;
}

const zeroOrMore = (parser, map) => nOrMore(0, parser, map);
const oneOrMore = (parser, map) => nOrMore(1, parser, map);

module.exports = {
	nOrMore,
	zeroOrMore,
	oneOrMore,
};
