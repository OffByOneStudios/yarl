'use babel'
import {compose} from 'redux';
import {Reducable, Documentable, Tagable, Testable} from '../decorators';

function backNav() {
  return {
    type: this.type,
  }
}

export default compose(
  Reducable((state, action) => {
    const previous = state.yarl.nav.before[state.yarl.nav.before.length - 1];
    if(previous === undefined) {return state;}
    const newBefore = state.yarl.nav.before.slice(0, state.yarl.nav.before.length - 1)
    return {
      ...state,
      yarl: {
        ...state.yarl,
        nav: {
          before: newBefore,
          now: previous,
          after: [state.yarl.nav.now, ...state.yarl.nav.after]
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
(backNav);
