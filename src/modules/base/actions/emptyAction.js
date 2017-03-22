'use babel'
import {compose} from 'redux';
import {Reducable, Documentable, Tagable, Testable} from '../../../configure/decorators';

function emptyAction() {
  return {
    type: this.type,
    data: {
      foo: 0
    }
  }
}
export default compose(
  Reducable((state, action) => {
    return {
      ...state,
      app: {
        ...state.app,
        base: {
          ...state.app.base,
          foo: action.data.foo
        }
      }
    }
  }),
  Documentable({
    text: `
    This Action Just shows that state works
    `
  }),
  Tagable({
    platform: 'any',
    async: false,
    hamburgers: 20
  }),
  Testable({
    'Is a Tautology': () => {
        return true;
    },
    'Has a Return Value': () => {
      return this.target() !== undefined;
    }
  }))
(emptyAction);
