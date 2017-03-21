'use babel'
import {Reducable} from '../../../configure/decorators/reducable';
import dotProp from 'dotprop';

function emptyAction() {
  return {
    type: this.type,
    data: {
      foo: 0
    }
  }
}
export default Reducable(emptyAction, (state, action) => {
  return dotProp.set(state, "base.empty", action.data);
});
