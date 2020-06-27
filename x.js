const f1 = () => {
  console.log('f2: ', f2());
};

const f2 = () => {
  console.log('f1: ', f1());
};

f1();
f2();
