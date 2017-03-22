import libs from './libs';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';

// This module
import actions from './actions';
import components from './components';
import yarlState from './defaultState';

export default function(defaultState={}, reducers={}, middlewares=[]) {
  const reducer = combineReducers({
    app: libs.reduce,
  });

  const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(ReduxThunk),
    // Required! Enable Redux DevTools with the monitors you chose
    // DevTools.instrument(),
  );

  return {
    ...libs.context,
    Store: createStore(reducer, {app: {
      yarl: yarlState,
      ...defaultState
    }}, enhancer)
  }
}
