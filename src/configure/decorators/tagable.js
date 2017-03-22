import {Documentable} from './documentable';

let Tags = {

}

function Tagable(props) {
  return (target) => {
    const n = target.name;
    Tags[n] = props;

    return target;
  }
}

Documentable({
  text: `
  Add machine readable metadata for a function.
  `,
  args: {
    tags: `Hash of key value pairs`
  }
})(Tagable);

export {Tags};
export {Tagable};
