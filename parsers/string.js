const { updateResult, updateError } = require('../utils/state');
const { zeroOrMore } = require('../combinators/more');

// return a string parser that can parse the given string

// create a string parser generator with given mathcing function and stuff
class StringParserGen {
	constructor({ charMatching, regex }) {
		// MATCHER

		// x is the index from which input is to be matched
		// str is the str that is to be matched
		// str may be null
		const matcher = function (str = null, x) {
			// line tracker
			let lines = 0;

			function matched(unConsumedIndex, matched) {
				return {
					consumed: true,
					unConsumedIndex,
					matched,
					lines,
				};
			}

			function notMatched(unConsumedIndex) {
				return {
					consumed: false,
					unConsumedIndex,
					matched: null,
					lines,
				};
			}
			// EOI handling
			if (str && x + str.length > input.length) {
				return {
					consumed: false,
					unConsumedIndex: x,
					eoi: true, // premature, end of input,
					matched: null,
				};
			}

			// CHAR MATCHING --------------------
			if (charMatching) {
				// run loop
				for (let i = 0; i < str.length; i++) {
					if (input[i] === '\n') {
						lines++;
					}

					// if condition fails for at least one char, fail
					if (!charMatching(str[i], input[x + i])) {
						return notMatched(x + i);
					}
				}

				// if condition passes for all chars, success
				return matched(x + str.length, str);
			}

			// REGEX MATCHING ----------------------
			// REGEX IS MATHCING ONLY FIRST CHAR OF INPUT TO GIVEN REGEX
			else if (regex) {
				// console.log('regex is ', regex);
				const regResult = input[x].match(regex);
				// if matched
				if (regResult && regResult[0]) {
					// regResult[0] is the matched string
					// if no matches, it is ""
					return matched(x + 1, regResult[0]);
				} else {
					return notMatched(x);
				}
			}
		};

		// RETURN STRING PARSER GEN
		// parser generater, generator
		function stringGen() {
			// const matcher = this.matcher;
			function string(str, map) {
				// create a parser that can parse str string
				// transform is a function that is run on parsed value to transform it from a string to any other structure
				const strParser = function (state) {
					const { index, hasError } = state;

					// if state has error, do nothing return state as is
					if (hasError) return state;

					// try to consume the str in input, starting from index = index

					// not all matched use str
					const status = matcher(str, index);

					// handle EOI
					if (status.eoi) {
						return updateError({
							state,
							error: `unexpected end of input, when trying to match string: "${str}" at index ${index}`,
						});
					}

					// if the str matched input, consider it as consumed
					if (status.consumed) {
						// if the transform function is given, transform the result
						// else the result is same as str string

						let parsed = map ? map(status.matched) : status.matched;

						// since the str string is consumed, update index to indicate that
						// status.unConsumedIndex, is where the str matched, so everything after that index is leftover string in input

						// update number of lines consumed in parsing
						const lines = state.lines + status.lines;

						return updateResult({ state, index: status.unConsumedIndex, parsed, lines });
					}

					// if the parser failed to match the str string to input string
					else {
						// produces error message like
						// expected 'xyz' but got 'abc' instead at index:56

						let error;
						if (str) {
							const got = input.substr(index, index + str.length);
							error = `expected "${str}", got "${got}" instead. ( error at index:${status.unConsumedIndex} )`;
						} else {
							error = `not expected:"${input[index]}"`;
						}

						return updateError({ state, error });
					}
				};

				return strParser;
			}

			return string;
		}

		return stringGen();
	}
}

const exact = new StringParserGen({
	charMatching: (strChar, inputChar) => strChar === inputChar,
});

const letter = map => {
	const letterParser = new StringParserGen({
		regex: /[a-zA-Z]/,
	});

	return letterParser(null, map); // called with no str
};

const digit = map => {
	const digitParseGen = new StringParserGen({
		regex: /[0-9]/,
	});

	return digitParseGen(null, map); // called with no str
};

const whitespaceChar = map => {
	const whitespaceCharParser = new StringParserGen({
		regex: /\s/,
	});

	return whitespaceCharParser(null, map); // called with no str
};

// CHANGE TO ONE OR MORE INSTEAD !
const letters = map =>
	zeroOrMore(letter(), arr => {
		const string = arr.join('');
		return map ? map(string) : string;
	});

const digits = map =>
	zeroOrMore(digit(), arr => {
		const value = Number(arr.join(''));
		return map ? map(value) : value;
	});

const whitespace = map =>
	zeroOrMore(whitespaceChar(), arr => {
		const value = arr.join('');
		return map ? map(value) : value;
	});

module.exports = {
	exact,
	letter,
	digit,
	letters,
	digits,
	whitespaceChar,
	whitespace,
};
