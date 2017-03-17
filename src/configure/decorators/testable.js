import Jest from 'jest';

function Testable(target, tests) {
  const n = (name) ? name : target.name;
  if(n in routes) {
    console.warn(`Route ${n} already refers to ${routes[n]}`);
  }
  else {
    Object.keys(tests).map((e) => {
      const bTarget = target.bind({target});
      Jest.test(e, tests[e]);
    });
  }
}

export {Testable};
