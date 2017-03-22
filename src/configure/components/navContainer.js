'use babel'
import {Documentable, Routable, Testable, Tagable, Typable} from '../decorators';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

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
