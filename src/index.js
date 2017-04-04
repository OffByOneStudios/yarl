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
import modules from './modules';

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
  return Object.keys(modules).reduce((st, e)=> {
    if (modules[e].defaultState) {
      st[e] = modules[e].defaultState
    }
    return st;
  }, {})
}

function extractGraphQLSchema(modules) {
  let gather = Object.keys(modules).reduce((st, e)=> {
    if(modules[e].model !== undefined) {
      st.inputs = st.inputs.concat(
        Object.keys(modules[e].model.inputs).map((f) => {
          return modules[e].model.inputs[f];
        })
      );

      st.types = st.types.concat(
        Object.keys(modules[e].model.types).map((f) => {
          return modules[e].model.types[f];
        })
      );

      st.queries.push(modules[e].model.queries);
      st.mutations.push(modules[e].model.mutations);
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
    window.defaultState = extractDefaultState(modules);
    const Schema = (extractGraphQLSchema(modules));
    window.Context = entrypoint(defaultState, {}, [], Schema);
    module.hot.accept('./', ()=> {
      wmain();
    })
    wmain();
  }
  else {
    global.defaultState = extractDefaultState(modules);
    const Schema = extractGraphQLSchema(modules);
    global.Context = entrypoint(defaultState, {}, [], Schema);

    nmain();
  }
}
