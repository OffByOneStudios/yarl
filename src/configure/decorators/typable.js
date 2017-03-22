import {Documentable} from './documentable';

let Types = {};

function Typable(name) {

  return (target) => {
    Types[name] = (Types[name] !== undefined) ? [...Types[name], target]: [target];
    return target;
  };
}

Documentable({
  text: `
  Associate a component with a GraphQL Type
  `,
  args: {
    name: `GraphQL Type name`
  }
})(Typable);

export {Types};
export {Typable};
