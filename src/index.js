import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import { AppContainer } from 'react-hot-loader';
// Import This First
import libs from './configure/libs';
import entrypoint from './configure/entrypoint';
import NavContainer from './configure/components/navContainer';

// Then Load Modules.
import modules from './modules';

function render() {
  ReactDOM.render((
    <AppContainer>
      <Provider store={Context.Store}>
        <NavContainer />
      </Provider>
    </AppContainer>
), document.getElementById('react-root'));
}


function extractDefaultState(modules) {
  return Object.keys(modules).reduce((st, e)=> {
    if (modules[e].defaultState) {
      st[e] = modules[e].defaultState
    }
    return st;
  }, {})
}


let Documentable = libs.documentable;
let Reducable = libs.reducable;
let Routable = libs.routable;
let Tagable = libs.tagable;
let Testable = libs.testable;
let Typable = libs.typable;

export {
  Documentable,
  Reducable,
  Routable,
  Tagable,
  Testable,
  Typable
}

export default {
  extractDefaultState,
  entrypoint,
  render
}

if(YARL_ENTRYPOINT) {
  if(!YARL_BROWSER) {
    const defaultState = extractDefaultState(modules);
    const Context = entrypoint(defaultState);
    Context.Commander.parse(process.argv);
  }
  else {
    window.defaultState = extractDefaultState(modules);
    window.Context = entrypoint(defaultState);
    module.hot.accept('./', ()=> {
      debugger;
      render();
    })
    render(modules, defaultState);
  }
}
