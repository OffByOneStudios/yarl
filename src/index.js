import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {ApolloProvider} from 'react-apollo';
// import { AppContainer } from 'react-hot-loader';
// Import This First
import libs from './configure/libs';
import entrypoint from './configure/entrypoint';
import NavContainer from './configure/components/navContainer';

// Then Load Modules.
import yarlModules from './modules';

function wmain() {
  ReactDOM.render((
    <ApolloProvider store={Context.Store} client={Context.GraphQL}>
      <NavContainer />
    </ApolloProvider>
  ), document.getElementById('react-root'));
}

function nmain() {
  Context.Commander.parse(process.argv);
}


function extractDefaultState(modules) {
  const mods = {...modules, ...yarlModules};
  return Object.keys(mods).reduce((st, e)=> {
    if (mods[e].defaultState) {
      st[e] = mods[e].defaultState
    }
    return st;
  }, {})
}

function extractGraphQLSchema(modules) {
  const mods = {...modules, ...yarlModules};
  let gather = Object.keys(mods).reduce((st, e)=> {
    if(mods[e].model !== undefined) {
      st.inputs = st.inputs.concat(
        Object.keys(mods[e].model.inputs).map((f) => {
          return mods[e].model.inputs[f];
        })
      );

      st.types = st.types.concat(
        Object.keys(mods[e].model.types).map((f) => {
          return mods[e].model.types[f];
        })
      );

      st.queries.push(mods[e].model.queries);
      st.mutations.push(mods[e].model.mutations);
    }
    return st;
  }, {types:[], inputs: [], queries: [], mutations:[] })

  return `
${gather.types.join("\n")}
${gather.inputs.join("\n")}

type Query {
  ${gather.queries.join("\n  ")}
}

type Mutation {
  ${gather.mutations.join("\n  ")}
}

schema {
  query: Query
  mutation: Mutation
}
`;
}

let Documentable = libs.documentable;
let Reducable = libs.reducable;
let Routable = libs.routable;
let Tagable = libs.tagable;
let Testable = libs.testable;
let Typable = libs.typable;

export {
  Documentable,
  Reducable,
  Routable,
  Tagable,
  Testable,
  Typable
}

export default {
  extractDefaultState,
  entrypoint,
  extractGraphQLSchema,
  wmain,
  nmain
}

if(YARL_ENTRYPOINT) {
  if(YARL_BROWSER) {
    window.gql = require('react-apollo').gql;
    window.defaultState = extractDefaultState({});
    const Schema = (extractGraphQLSchema({}));
    window.Context = entrypoint(defaultState, {}, [
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ], Schema);
    module.hot.accept('./', ()=> {
      wmain();
    })
    wmain();
  }
  else {
    global.defaultState = extractDefaultState({});
    const Schema = extractGraphQLSchema({});
    global.Context = entrypoint(defaultState, {}, [

    ], Schema);

    nmain();
  }
}
