'use babel'

import actions from './actions';
import components from './components';
import defaultState from './defaultState.js';
import libs from './libs';
import model from './model';
let styles = {};

if(YARL_BROWSER) {
  styles = require('./styles');
}

export default {
  actions,
  components,
  defaultState,
  libs,
  model,
  styles,
};
