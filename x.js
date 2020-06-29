/* eslint-disable no-console */
// const input = 'something';

// function parser(name, options = {}) {
//   options.lookAhead(name, options);

//   if (options.optional) return 'optional';
//   if (name === input) return true;
//   return false;
// }

// console.log(
//   parser('cool', {
//     lookAhead: (name, op) => {
//       if (name === 'cool') {
//         op.optional = true;
//       }
//     },
//   }),
// );

const a = () => {
  const b = () => console.log('b:', x);
  console.log('a:', x);
  b();
  const x = 5;
};

const x = 1;

a();
