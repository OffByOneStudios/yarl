
let Documents = [];

function Documentable(target, docs) {
  const n = (name) ? name : target.name;
  Documents.append({...docs, name: n});
}

export {Documents};
export {Documentable};
