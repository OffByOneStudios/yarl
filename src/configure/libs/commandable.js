import Documentable from './documentable';

import Context from './context';

if (!YARL_BROWSER) {
  Context.Commander = require('commander');
}
else {
  Context.Commander = {
    command() {
      return this;
    },
    description() {
      return this;
    },
    action() {
      return this;
    },
    option() {
      return this;
    }
  }
}


function Commandable(fn) {
  return (target) => {
    fn(Context.Commander);

    return target;
  }
}

export default Documentable({
  text: `
  Add a function to the command line interface.
  `,
  args: {
    fn: `Function to invoke`
  }
})(Commandable);
