import Context from './decorators';
import libs from './libs';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';

export default function() {
  const reducer = combineReducers({
    app: Context.reduce
  });

  const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(ReduxThunk, libs.socketMiddleware),
    // Required! Enable Redux DevTools with the monitors you chose
    // DevTools.instrument(),
  );
}
