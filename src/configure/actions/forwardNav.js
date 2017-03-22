'use babel'
import {compose} from 'redux';

import Reducable from '../libs/reducable';
import Documentable from '../libs/documentable';
import Tagable from '../libs/tagable';
import Testable from '../libs/testable';

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
