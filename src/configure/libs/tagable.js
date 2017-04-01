import Documentable from './documentable';

import Context from './context';



function Tagable(props) {
  return (target) => {
    const n = target.name;
    Context.Tags[n] = props;

    if(!props.platform) {
      return {};
    }

    return target;
  }
}

export default Documentable({
  text: `
  Add machine readable metadata for a function.
  `,
  args: {
    tags: `Hash of key value pairs`
  }
})(Tagable);
