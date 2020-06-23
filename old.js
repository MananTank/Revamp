// parser creators

// str returns a parser that can parse string s
// parser takes a state, parses the input, reuturns a new state
// state contains input, index to start parsing from

// mapFn is to be applied on result
const str = s => state => {
	const { input, index, hasError } = state;
	if (hasError) return state; // if input state has error, do not return new state
	const status = consume(s, input, index);

	if (status.eoi) {
		return errorState({
			state,
			error: `unexpected end of input, when trying to match "${s}" at index ${index}`,
		});
	}

	if (status.consumed) {
		if (mapFn) {
			console.log('map is : ', mapFn);
			console.log('map("text") :', mapFn(s));
		}

		const result = mapFn ? mapFn(s) : s;

		return consumedState({ state, status, result });
	} else {
		const error = `expected "${s[0]}", got "${input[status.unConsumedIndex]}" instead at index:${
			status.unConsumedIndex
		}`;
		return errorState({ state, error });
	}
};

// run a seq of parsers
// takes a state, runs all the parsers in array, returns new state
// stores result from all the parsers in results array in the new state
const seq = (...parsers) => state => {
	if (state.hasError) return state;

	let newState = state;
	let results = [];
	for (let parser of parsers) {
		newState = parser(newState);
		if (newState.hasError) break;
		console.log(newState.result);
		results.push(newState.result);
	}

	return {
		...newState,
		result: results, // override last parser's result to results array
	};
};

// My name is Manan Tank
// { name: 'Manan', surname: 'Tank' }

const parser = seq(
	str('hello', i => i.toUpperCase()),
	str(' '),
	str('world')
);

const tree = parse(parser, 'hello world');
console.log(tree);

// each parser would need to have this
// take state
// check hasError
// consume string
// return new state

const str = new Parser();

const stringParsing = state => {
	const { input, index, hasError } = state;
	if (hasError) return state; // if input state has error, do not return new state
	const status = consume(s, input, index);

	if (status.eoi) {
		return errorState({
			state,
			error: `unexpected end of input, when trying to match "${s}" at index ${index}`,
		});
	}

	if (status.consumed) {
		if (mapFn) {
			console.log('map is : ', mapFn);
			console.log('map("text") :', mapFn(s));
		}

		const result = mapFn ? mapFn(s) : s;

		return consumedState({ state, status, result });
	} else {
		const error = `expected "${s[0]}", got "${input[status.unConsumedIndex]}" instead at index:${
			status.unConsumedIndex
		}`;
		return errorState({ state, error });
	}
};
