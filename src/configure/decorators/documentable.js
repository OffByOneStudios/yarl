
let Documents = [];

function Documentable(docs) {
  return (target) => {
    const name = target.name;
    Documents.push({...docs, name, target});
    return target;
  };
}

Documentable({
  text:`
  Decorator which Generates documentation
  `,
  args: {
    docs: `An Object of shape {text, args, propTypes}`
  }
})(Documentable);
export {Documents};
export {Documentable};
