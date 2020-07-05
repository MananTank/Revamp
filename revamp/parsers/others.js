const regex = require('./regex');

const alpha = (op) => regex(/^[a-zA-Z]+/, op, 'alpha');

// convert to number
const numeric = (op = {}) => {
  if (op.revamp) {
    const fn = op.revamp;
    op.revamp = (v) => fn(Number(v));
  } else {
    op.revamp = Number;
  }
  return regex(/^[0-9]+/, op, 'numeric');
};

const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');

const singleWhitespace = (op) => regex(/^\s/, op, 'singleWhitespace');
const whitespace = (op) => regex(/^\s+/, op, 'whitespace');

module.exports = {
  alpha,
  numeric,
  alphaNumeric,
  alphaNumerics,
  singleWhitespace,
  whitespace,
};
