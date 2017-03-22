'use babel'
import {compose} from 'redux';
import {Reducable, Documentable, Tagable, Testable} from '../decorators';

function forwardNav() {
  return {
    type: this.type,
  }
}

export default compose(
  Reducable((state, action) => {
    const next = state.yarl.nav.after[0];
    if(next === undefined) { return state;}
    const newAfter = state.yarl.nav.after.slice(1);
    return {
      ...state,
      yarl: {
        ...state.yarl,
        nav: {
          before: newBefore,
          now: next,
          after: newAfter
        }
      }
    };
  }),
  Documentable({
    text: `
    Push a route onto the nav stack
    `
  }),
  Tagable({
    platform: 'any',
    async: false,
  }),
  Testable({
    'Is a Tautology': () => {
        return true;
    },
  }))
(forwardNav);
