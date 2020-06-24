// if an object is a state, return true
// this for checking correct argument s
function isState(obj) {
  const keys = ['hasError', 'error', 'parsed', 'lines', 'index'];
  for (k of keys) {
    return !(obj[k] === undefined);
  }
  return true;
}

function checkState(x) {
  if (!isState(x)) {
    console.error('expected state as argument, but got: ', x, 'instead');
  }
}

module.exports = checkState;
