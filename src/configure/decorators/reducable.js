

let Actions = {};
let Reducers = {};

function Reducable(target, reducer) {
  Actions[target.name] = target.bind({type: target.name});
  Reducers[target.name] = reducer;
}

export {Reducers};
export {Reducable};

export function reduce(state = {}, action) {
  Object.keys(Reducers).map((e) => {
    if(e === action.type) {
      return Reducers[e](state, action);
    }
    return state;
  });
  return state;
}
