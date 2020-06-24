// create a matcher that matches a string kind of string using a certain kind of logic
class Matcher {
  constructor(matchLogic) {
    this.matchLogic = matchLogic;
  }

  match(inputIndex, parseString) {
    // eslint-disable-next-line max-len
    const notEnoughInputStringLeft = parseString && inputIndex + parseString.length > global.input.length;
    const reachedAtTheEnd = inputIndex === global.input.length;
    if (notEnoughInputStringLeft || reachedAtTheEnd) {
      return Matcher.endOfInputError(inputIndex);
    }

    return this.matchLogic(inputIndex, parseString);
  }

  static matched(unConsumedIndex, matched) {
    return {
      consumed: true,
      unConsumedIndex,
      matched,
    };
  }

  static notMatched(unConsumedIndex) {
    return {
      consumed: false,
      unConsumedIndex,
      matched: null,
      // lines,
    };
  }

  static endOfInputError(x) {
    return {
      consumed: false,
      unConsumedIndex: x,
      eoi: true,
      matched: null,
    };
  }
}

module.exports = Matcher;
