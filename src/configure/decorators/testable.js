
import {Documentable} from './documentable';
let Tests = {};

function Testable(tests) {
  return (target) => {
    const n = (name) ? name : target.name;
    Tests[n] = Object.keys(tests).reduce((res, e) => {
      res[e] = tests[e].bind({target});
      return res;
    }, {});
    return target;
  }
}

Documentable({
  text: `
  Associate unit tests with an object.
  `,
  args: {
    tests: `Hash of testname:()=>{} pairs. Target method is bound to testing function`
  }
})(Testable);

export {Tests}
export {Testable};
