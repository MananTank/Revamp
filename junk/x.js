/* eslint-disable no-console */
const fn = (x, mappingFn) => {
  console.log(mappingFn ? mappingFn(x) : x);
};

fn.map = (mappingFn) => (x) => fn(x, mappingFn);

fn.map((i) => i * 10);
