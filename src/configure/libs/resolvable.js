
'use babel'
import Documentable from './documentable';
import Context from './context';
function Resolvable(path) {
  return (target) => {
    const items = path.split(".");
    let walk = Context.Resolver;
    for(let i = 0; i < items.length - 1; i++) {
      if(walk[items[i]] == undefined) {
        walk[items[i]] = {};
      }
    }
    if(walk[items[items.length - 1]] !== undefined) {
      console.info(`Resolver ${target.name} Is Overriding ${path}`);
    }
    walk[items[items.length - 1]] = target;

    return target;
  }
}

export default Documentable({
  text: `
# Registers a function as a GraphQL Resolver.

Given a GraphQL Schema with a Query/Mutation
\`\`\`graphql
Query {
  dogs(breed: String): [Dogs]

}
\`\`\`
A function can be decorated to resolve said Query:

\`\`\`js
import {compose} from 'redux';
import Resolvable from '@offbyonestudios/yarl/configure/libs/resolvable';

function getDogs(breed) {
  new Promise((resolve, reject) => {
    fetch("http://allthedogs.gov/dogs?breed=\${breed}")
    .then((response) => {
      return response.json()
    }).then(json => resolve(json))
    .catch((err) => {reject})
  });
}
export default compose(
  Resolvable("Query.dogs")
)(getDogs)
\`\`\`
  `
})(Resolvable)
