const x = {
  a: 'a is first',
  b: 'b is second',
};

const keys = Object.keys(x);

function appearsFirst(key1, key2) {
  const indexOfKey1 = keys.findIndex(key1);
  const indexOfKey2 = keys.findIndex(key2);
  return indexOfKey1 < indexOfKey2;
}

console.log(appearsFirst('a', 'b'));