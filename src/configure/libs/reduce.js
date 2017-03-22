import {compose} from 'redux';

import Context from './context';
import Documentable from './documentable';

function reduce(state = {}, action) {
  for(var e in Context.Reducers) {
    if(e === action.type) {
      return Context.Reducers[e](state, action);
    }
  }
  return state;
}


export default compose(
  Documentable({
    text: `
    This is the top level Reducer for YARL apps.
    `,
    args: {
      state: `Current Redux state`,
      action: `Action type and payload to perform on state`
    },
    returns: `New State`
  })
)(reduce);
