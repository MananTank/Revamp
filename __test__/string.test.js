const { string, letter } = require('../parsers/string');
const run = require('../utils/run');

describe('string()', () => {
  const parser = string('xyz');

  test('parses the string that it is supposed to parse', () => {
    const tree = run(parser, 'xyz1234');
    expect(tree.parsed).toBe('xyz');
    expect(tree.index).toBe(3);
    expect(tree.hasError).toBe(false);
  });

  test('does not parse string that it is not supposed to parse', () => {
    const tree = run(parser, '1234xyz');
    expect(tree.parsed).toBe(null);
    expect(tree.index).toBe(0);
    expect(tree.hasError).toBe(true);
  });

  test('maps parsed value as expected', () => {
    const parser2 = string('xyz', (parsed) => ({
      value: parsed.toUpperCase(),
    }));

    const tree = run(parser2, 'xyz123');
    expect(tree.parsed).toEqual({
      value: 'XYZ',
    });
    expect(tree.index).toBe(3);
    expect(tree.hasError).toBe(false);
  });
});

describe('letter()', () => {
  const parser = letter();

  test('parses one letter and stops when successful', () => {
    const tree = run(parser, 'xyz1234');
    expect(tree.parsed).toBe('x');
    expect(tree.index).toBe(1);
    expect(tree.hasError).toBe(false);
  });

  test('does not parse non-letter character ', () => {
    const tree = run(parser, '1234xyz');
    expect(tree.parsed).toBe(null);
    expect(tree.index).toBe(0);
    expect(tree.hasError).toBe(true);
  });
});
