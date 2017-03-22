
let Documents = [];

function Documentable(docs) {
  return (target) => {
    const name = target.name;
    Documents.push({...docs, name, target});
    return target;
  };
}

export {Documents};
export {Documentable};
