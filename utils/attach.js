function attachMap(fn) {
  fn.map = (mapFn) => (x) => fn(x, mapFn);
  return fn;
}
