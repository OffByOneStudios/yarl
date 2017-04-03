import libs from './libs';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';

// This module
import actions from './actions';
import components from './components';
import yarlState from './defaultState';


const emptySchema = `
type Query {

}

type Mutation {

}

schema {
  query: Query
  mutation: Mutation
}
`;

let entrypoint;

if(YARL_BROWSER) {
  entrypoint = (defaultState={}, reducers={}, middlewares=[], schemaString=emptySchema) => {
    const apollo = require('react-apollo');

    const networkInterface = apollo.createNetworkInterface({
      uri: 'http://localhost:3000/graphql',
      // opts: {
      //   credentials: 'include',
      // },
    })
    const GraphQL = new apollo.ApolloClient({networkInterface});

    const reducer = combineReducers({
      app: libs.reduce,
      apollo: GraphQL.reducer(),
    });

    const enhancer = compose(
      applyMiddleware(ReduxThunk),
      applyMiddleware(GraphQL.middleware())
    );
    return {
      ...libs.context,
      Store: createStore(reducer, {app: {
        yarl: yarlState,
        ...defaultState
      }}, enhancer),
      GraphQL
    }
  }
}

else {
  entrypoint = (defaultState={}, reducers={}, middlewares=[], schemaString=emptySchema) => {
    const graphql_tools = require('graphql-tools');
    const GraphQL = graphql_tools.makeExecutableSchema({
      typeDefs: [schemaString],
      resolvers: libs.context.Resolvers,
      //logger: (args)=>{console.log(args);}, // optional
      allowUndefinedInResolve: true, // optional
      resolverValidationOptions: {
        requireResolversForArgs: false,
        requireResolversForNonScalar: false
      }, // optional
    });

    return {
      ...libs.context,
      GraphQL
    };
  }
}

export default entrypoint;
