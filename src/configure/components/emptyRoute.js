'use babel'
import {compose} from 'redux';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Routable from '../libs/routable';
import Documentable from '../libs/documentable';
import Tagable from '../libs/tagable';
import Testable from '../libs/testable';
import Typable from '../libs/typable';

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
    return (
      <blockquote>
        <p><em>Yeah!! Milligram is amazing.</em></p>
      </blockquote>
    );
  }
}
