// run the parser
// call the fn with the parser result
// return the parser that is returned by fn

// example

/*
branch(letters(), state => {
   const {parsed, index} = state;
   console.log('branching done at', index);
   if (parsed === 'yo!') return greetingsParser( x => x.toUpperCase() )
})

*/

function branch(parser, fn) {
  return function branchParser(state) {
    const newState = parser(state);
    return fn(newState);
  };
}

module.exports = branch;
