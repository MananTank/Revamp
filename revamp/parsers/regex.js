const createParser = require('../utils/createParser');

function regex(rExp, op, parses) {
  let safeRegExp = rExp;

  // all regex must start with ^, because regex must only match with the starting of input
  if (String(rExp)[1] !== '^') {
    let r = String(rExp);
    r = r.substring(1, r.length - 1);
    safeRegExp = new RegExp(`^${r}`);
    console.warn(
      '\n!! WARNING !!\nPROVIDED REGEX WAS INVALID, ALL REGEX MUST STARt WITH ^ IN TO ENSURE THAT REGEX IS ALWAYS MATCHED AT THE BEGGING OF INPUT \nADDED ^ AT THE BEGINNING OF REGEX TO FIX THE ISSUE ',
    );
  }

  const logic = (state) => {
    const { index } = state;
    const result = global.input.slice(index).match(safeRegExp);

    // pass ✔️
    if (result && result[0]) return { ...state, parsed: result[0], index: index + result[0].length };
    // fail ❌
    return {
      ...state,
      error: {
        type: 'regex',
        parser: 'regex',
        expected: parses,
        got: `${global.input.slice(index, index + 10)}...`,
        index: 0,
      },
    };
  };

  return createParser(logic, op, { type: 'regex()', parses });
}

module.exports = regex;
