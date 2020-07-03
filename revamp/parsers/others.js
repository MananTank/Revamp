const regex = require('./regex');

const letters = (op) => regex(/^[a-zA-Z]+/, op, 'letters');
const letter = (op) => regex(/^[a-zA-Z]/, op, 'letter');

const number = (op) => regex(/^[0-9]/, op, 'number');
const numbers = (op) => regex(/^[0-9]+/, op, 'numbers');

const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');

const singleWhitespace = (op) => regex(/^\s/, op, 'singleWhitespace');
const whitespace = (op) => regex(/^\s+/, op, 'whitespace');
const optionalWhitespace = (op) => regex(/^\s+/, op, 'whitespace');

module.exports = {
  letter,
  letters,
  number,
  numbers,
  alphaNumeric,
  alphaNumerics,
  singleWhitespace,
  whitespace,
  optionalWhitespace,
};
