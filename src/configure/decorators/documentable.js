
let Documents = [];

function Documentable(target, docs) {
  const name = target.name;
  Documents.push({...docs, name});

  return target;
}

export {Documents};
export {Documentable};
