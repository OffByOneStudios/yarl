'use babel'
import {compose} from 'redux';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Routable from '../libs/routable';
import Documentable from '../libs/documentable';
import Tagable from '../libs/tagable';
import Testable from '../libs/testable';
import Typable from '../libs/typable';


const $d = (actionType) => {
  return window.Context.Store.dispatch(actionType);
}
const $a = (actionName) => {
  return window.Context.Actions[actionName];
}

@connect((state) => {
  return {
    // empty: state.app.base.empty
  };
})
@Documentable({
  text:
  `
  This Component Shows there are no routes mounted
  `,
  propTypes: {
    foo: `AThing`
  }
})
@Testable({
  'This Is Always True': () => {
      return true;
  },
})
@Tagable({
  platform: 'any',
})
@Typable("Nothing")
@Routable("emptyRoute")
export default class emptyRoute extends Component {
  static propTypes = {
    routeProps: PropTypes.object
  }


  render() {
    const items = Object.keys(Context.Routes).map((e, i)=>{
      return (
        <div key={i}>
          <div className="hoverable" onClick={() => {$d($a("setNav")(e))}}>
            <div>{Context.Routes[e].displayName || e}</div>
          </div>
          <div>{Context.Routes[e].description}</div>
        </div>
      )
    })
    return (
      <div>
        {items}
      </div>
    );
  }
}
