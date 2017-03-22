'use babel'
import {compose} from 'redux';

import Reducable from '../libs/reducable';
import Documentable from '../libs/documentable';
import Tagable from '../libs/tagable';
import Testable from '../libs/testable';

function setNav(route, props) {
  return {
    type: this.type,
    route,
    props
  }
}

export default compose(
  Reducable((state, action) => {
    return {
      ...state,
      yarl: {
        ...state.yarl,
        nav: {
          before: [...state.yarl.nav.before, state.yarl.nav.now],
          now: {route: action.route, props: action.props},
          after: []
        }
      }
    }

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
(setNav);
