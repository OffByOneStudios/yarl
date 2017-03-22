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
    nav: state.app.yarl.nav
  };
})
@Documentable({
  text:
  `
  This Component routes like a stack.
  `,
  propTypes: {
    nav: `The Nav State`
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
export default class navContainer extends Component {
  static propTypes = {
    nav: PropTypes.object
  }

  render() {
    const Route = Context.Routes[this.props.nav.now.route]();
    return (<Route routeProps={this.props.nav.now.props} />);
  }
}
