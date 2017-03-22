import Documentable from './documentable';
import Context from './context';


function Typable(name) {

  return (target) => {
    Context.Types[name] = (Context.Types[name] !== undefined) ? [...Context.Types[name], target]: [target];
    return target;
  };
}

export default Documentable({
  text: `
  Associate a component with a GraphQL Type
  `,
  args: {
    name: `GraphQL Type name`
  }
})(Typable);
