import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {Provider} from 'react-redux';
import io from 'socket.io-client';

// Import This First
import entrypoint from './configure/entrypoint';
import NavContainer from './configure/components/navContainer';
// Then Load Modules.

function render() {
  ReactDOM.render((
  <AppContainer>
    <Provider store={Context.Store}>
      <NavContainer />
    </Provider>
  </AppContainer>
), document.getElementById('react-root'));
}


if (module.hot) {
  module.hot.accept('./', render)
  // module.hot.accept('./modules', render);
}

function extractDefaultState(modules) {
  return Object.keys(modules).reduce((st, e)=> {
    if (modules[e].defaultState) {
      st[e] = modules[e].defaultState
    }
    return st;
  }, {})
}

export default {
  extractDefaultState,
  entrypoint,
  render
}
