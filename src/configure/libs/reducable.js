
import Context from './context';
import Documentable from './documentable';


function Reducable(reducer) {
  return (target) => {
    Context.Actions[target.name] = target.bind({type: target.name});
    Context.Reducers[target.name] = reducer;

    return target;
  };
}

export default Documentable({
  text: `
  Decorator which joins a redux action and it's corresponding reducerl
  `,
  args: {
    reducer: `Function of signature (state, action) => {return newState}`
  }
})(Reducable);
