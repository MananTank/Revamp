// console log before and after states

function debug(parser) {
  return function branchParser(state) {
    const newState = parser(state);
    console.info('before parsing : ', state);
    console.info('after parsing : ', newState);
    return newState;
  };
}

module.exports = debug;
