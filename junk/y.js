// const Matcher = require('../utils/Matcher');
// const { matchString } = require('../utils/matching');
// const { updateError, updateResult } = require('../utils/state');

// // setLogic() adds matching logic to makeParser()
// const run = require('../utils/run');

// // makeLogic() makes the parser function that can parse given string
// // parser function parses given state and returns a new state

// function createParser(logic) {
//   const matcher = new Matcher(logic);
//   return function makeParser(str) {
//     function parser(state, map) {
//       const { index, hasError } = state;

//       if (hasError) return state;

//       let status;
//       if (str) {
//         status = matcher.match(str, index);
//       } else {
//         status = matcher.match(index);
//       }

//       // handle EOI
//       if (status.eoi) {
//         return updateError({
//           state,
//           error: `unexpected end of input, when trying to match string: "${str}" at index ${index}`,
//         });
//       }

//       // if parsed successfully
//       if (status.consumed) {
//         // console.log('------------');

//         // Parser.map(status.matched);
//         return updateResult({
//           state,
//           index: status.unConsumedIndex,
//           parsed: status.matched,
//           map,
//         });
//       }

//       // if parsing failed
//       let error;
//       if (str) {
//         const got = global.input.substr(index, index + str.length);
//         error = `expected "${str}", got "${got}" instead. ( error at index:${status.unConsumedIndex} )`;
//       } else {
//         error = `not expected:"${global.input[index]}"`;
//       }

//       return updateError({ state, error });
//     }

//     parser.map = (mapFn) => (state) => parser(state, mapFn);
//     return parser;
//   };
// }

// module.exports = createParser;

// const str = createParser(matchString);

// // console.log(str());
// const parser = str('cool').map((s) => s.toUpperCase());

// const tree = run(parser, 'cool is a string');

// console.log(tree);
