/* eslint-disable no-console */
const { str, parse } = require('./index');

// if there is beans after it
// cool is optional

const parser = str(';', {
  lookAhead: (state, op) => {
    if (state.error) {
      const next = str('beans')(state);
      console.log('next is', next);
      if (!next.error) {
        op.optional = true;
      }
    }
  },
});

const ast = parse({
  parser,
  input: 'beans',
});

console.log(ast);
