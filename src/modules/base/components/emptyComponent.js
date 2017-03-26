import React from 'react';

import Documentable from '../../../configure/libs/documentable';
import Routable from '../../../configure/libs/routable';
import Testable from '../../../configure/libs/testable';
import Tagable from '../../../configure/libs/tagable';
import Typable from '../../../configure/libs/typable';

import {connect} from 'react-redux';


@connect((state) => {
  return {
    empty: state.app.base.empty
  };
})
@Documentable({
  text:
  `
  This Component is Left Intentionally Blank
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
  platform: 'web',
})
@Typable("Nothing")
class EmptyComponent extends React.Component {
  static propTypes = {

  }

  render() {
    return (
      <div className="container">
        Empty Component
      </div>
    );
  }
}

export default EmptyComponent;
