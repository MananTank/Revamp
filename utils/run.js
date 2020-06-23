// runs the parser with given input

// given input is saved in global object, so any function has the access to it
// why make it global ? - better performance for super long input strings
// such as parsing a 10000+ lines of code

// input is only set to global while whilte the run runs
// after the run completes, input is not available on global
function run(parser, input) {
	global.input = input;
	const tree = parser({
		index: 0,
		hasError: false,
		error: null,
		parsed: null,
		lines: 0,
	});
	global.input = null;
	return tree;
}

module.exports = run;
