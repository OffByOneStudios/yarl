'use babel'
import {Documentable, Routable, Testable, Tagable, Typable} from '../decorators';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

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
      <div>You Have No Routes! Make Some.</div>
    );
  }
}
