// a parser when sees a state that already has error, does not do anything and returns as it is
// so the state bubbles up to the end

// const handleError = (fn) => (s, op) => {
//   if (!s) {
//     console.log('-----------------------------------------------');
//     console.error(`ERROR: ${fn.name}() called without first argument !`);
//     console.log('------------------------------------------------');
//     return null;
//   }
//   return fn(s, op);
// };

// const string = handleError(str);
