function matched(unConsumedIndex, matchedString) {
  return {
    consumed: true,
    unConsumedIndex,
    matched: matchedString,
  };
}

function notMatched(unConsumedIndex) {
  return {
    consumed: false,
    unConsumedIndex,
    matched: null,
    // lines,
  };
}

function endOfInputError(x) {
  return {
    consumed: false,
    unConsumedIndex: x,
    eoi: true,
    matched: null,
  };
}

class Matcher {
  constructor(matchLogic) {
    this.matchLogic = matchLogic;
  }

  match(inputIndex, parseString) {
    // eslint-disable-next-line max-len
    const notEnoughInputStringLeft = parseString && inputIndex + parseString.length > global.input.length;
    const reachedAtTheEnd = inputIndex === global.input.length;
    if (notEnoughInputStringLeft || reachedAtTheEnd) {
      return endOfInputError(inputIndex);
    }

    return this.matchLogic(inputIndex, parseString);
  }
}

// ----------------------
function matchString(str, x) {
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] !== global.input[x + i]) {
      return notMatched(x + i);
    }
  }
  return matched(x + str.length, str);
}

function matchRegex(regex) {
  return (inputIndex) => {
    const regResult = global.input.slice(inputIndex).match(regex);

    if (regResult && regResult[0]) {
      return matched(inputIndex + regResult[0].length, regResult[0]);
    }
    return notMatched(inputIndex);
  };
}

module.exports = { Matcher, matchString, matchRegex };
