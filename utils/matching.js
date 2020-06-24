const Matcher = require('../classes/Matcher');

function matchString(str, x) {
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] !== global.input[x + i]) {
      return Matcher.notMatched(x + i);
    }
  }
  return Matcher.matched(x + str.length, str);
}

function matchRegex(regex) {
  return (inputIndex) => {
    const regResult = global.input.slice(inputIndex).match(regex);

    if (regResult && regResult[0]) {
      return Matcher.matched(inputIndex + regResult[0].length, regResult[0]);
    }
    return Matcher.notMatched(inputIndex);
  };
}

module.exports = {
  matchString,
  matchRegex,
};
