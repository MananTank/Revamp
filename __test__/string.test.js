const string = require('../parsers/string');
const run = require('../utils/run');

test('parses string correctly if parsing succesed', () => {
	const aParser = string('a');
	const tree = run(aParser, 'abc');
	const expectedTree = { index: 1, hasError: false, error: null, parsed: 'a', lines: 0 };

	expect(tree).toEqual(expectedTree);
});

test('parses string correcttly if parsing failed', () => {
	const aParser = string('a');
	const tree = run(aParser, 'xyz');

	// dont care about the error message, so not comparing the whole tree but only the parts that matters
	expect(tree.hasError).toBe(true);
	expect(tree.parsed).toBe(null);
	expect(tree.index).toBe(0);
});
