
import Context from './context';

function Documentable(docs) {
  return (target) => {
    const name = target.name;
    Context.Documents[name] = ({...docs, target});
    return target;
  };
}

export default Documentable({
  text:`
  Decorator which Generates documentation
  `,
  args: {
    docs: `An Object of shape {text, args, propTypes}`
  }
})(Documentable);
