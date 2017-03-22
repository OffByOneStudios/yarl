
import {Documentable} from './documentable';

let Actions = {};
let Reducers = {};

function Reducable(reducer) {
  return (target) => {
    Actions[target.name] = target.bind({type: target.name});
    Reducers[target.name] = reducer;

    return target;
  };
}

Documentable({
  text: `
  Decorator which joins a redux action and it's corresponding reducerl
  `,
  args: {
    reducer: `Function of signature (state, action) => {return newState}`
  }
})(Reducable);

export {Actions}
export {Reducers};
export {Reducable};

export function reduce(state = {}, action) {
  for(var e in Reducers) {
    if(e === action.type) {
      return Reducers[e](state, action);
    }  
  }
  return state;
}
