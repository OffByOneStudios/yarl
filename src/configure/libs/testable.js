
import Documentable from './documentable';
import Context from './context';

function Testable(tests) {
  return (target) => {
    Context.Tests[target.name] = Object.keys(tests).reduce((res, e) => {
      res[e] = tests[e].bind({target});
      return res;
    }, {});
    return target;
  }
}

export default Documentable({
  text: `
  Associate unit tests with an object.
  `,
  args: {
    tests: `Hash of testname:()=>{} pairs. Target method is bound to testing function`
  }
})(Testable);
