// // a lightweight parsor combinator library for creating complex parsor
// // using functional parsor model

// // try to consume str string from index x

// class Matcher {
// 	constructor({ matchingLogic, charByCharMatching }) {
// 		this.matchingLogic = matchingLogic;
// 		this.charByCharMatching = charByCharMatching;

// 		return function () {
// 			// EOI handling
// 			if (x + str.length > input.length) {
// 				return {
// 					consumed: false,
// 					unConsumedIndex: x,
// 					eoi: true, // premature, end of input
// 				};
// 			}

// 			// line tracker
// 			let lines = 0;

// 			if (charByCharMatching) {
// 				// run loop
// 				for (let i = 0; i < str.length; i++) {
// 					if (input[i] === '\n') {
// 						lines++;
// 					}

// 					if (charByCharMatching(str[i], input[x + i]))
// 						return {
// 							consumed: false,
// 							unConsumedIndex: x + i,
// 						};
// 				}
// 			} else {
// 			}

// 			return {
// 				consumed: true,
// 				unConsumedIndex: x + str.length,
// 				lines: lines,
// 			};
// 		};
// 	}
// }

// // matching Logic takes three inputs str, i and x
// // this is for matching as :
// // match ith character of str to input where the checking of input should be
// const exact = new Matcher({
// 	charByCharMatching: (strChar, inputChar) => strChar === inputChar,
// });

// const not = s =>
// 	new Matcher({
// 		stringMatching: str => str !== s,
// 	});

// module.exports = consume;
