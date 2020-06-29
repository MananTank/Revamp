const { str, parse } = require('../index.js');

test('can match entire string', () => {
  const input = 'this is some string';
  const output = parse({
    parser: str(input),
    input,
  });

  expect(output).toEqual({
    index: input.length,
    parsed: input,
    error: null,
  });
});

test('does not return error if the string is optional', () => {
  const input = 'this is some string';
  const output = parse({
    parser: str(input, { optional: true }),
    input: 'this is a different string',
  });

  expect(output).toEqual({
    index: 0,
    parsed: null,
    error: null,
  });
});

test('returns EOI error when, end of input reached', () => {
  const input = 'this is some string';
  const output = parse({
    parser: str(input),
    input: 'this is',
  });

  expect(output).toEqual({
    index: 0,
    parsed: null,
    error: {
      type: 'unexpected end of input',
      parser: 'str',
    },
  });
});

test('can revamp the parsed string to given structure', () => {
  const input = 'super cool';

  const parser = str(input, {
    revamp: (s) => ({
      value: s.toUpperCase(),
    }),
  });

  const output = parse({
    parser,
    input,
  });

  expect(output).toEqual({
    index: input.length,
    parsed: {
      value: input.toUpperCase(),
    },
    error: null,
  });
});
