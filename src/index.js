import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import io from 'socket.io-client';

// Import This First
import entrypoint from './configure/entrypoint';

// Then Load Modules.
import modules from './modules';

let defaultState = Object.keys(modules).reduce((st, e)=> {
    if (modules[e].defaultState) {
      st[e] = modules[e].defaultState
    }
    return st;
}, {})

console.log(defaultState);
// Then Invoke Entrypoint
window.Context = entrypoint(defaultState);

function render() {
  ReactDOM.render((
  <AppContainer>
    <div style={{display: 'flex'}}>
      Hello
    </div>
  </AppContainer>
), document.getElementById('react-root'));
}
render();

if (module.hot) {
  module.hot.accept('./', render)
  // module.hot.accept('./modules', render);
}
