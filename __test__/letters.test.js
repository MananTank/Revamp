const { letters, parse } = require('../index.js');

test('can match letters', () => {
  const parser = letters();
  const input = 'this is some string';

  const output = parse({ parser, input });

  expect(output).toEqual({
    index: 4,
    parsed: 'this',
    error: null,
  });
});

test('no error, when parsing failed, but it was optional', () => {
  const parser = letters({ optional: true });
  const input = '123this is some string';

  const output = parse({ parser, input });

  expect(output).toEqual({
    index: 0,
    parsed: null,
    error: null,
  });
});

test('error when parsing failed', () => {
  const parser = letters();
  const input = '123this is some string';

  const output = parse({ parser, input });

  expect(output).toEqual({
    index: 0,
    parsed: null,
    error: {
      index: 0,
      parser: 'regex',
      type: 'regex',
      expected: /^[a-zA-Z]+/,
      got: '123this is...',
    },
  });
});
