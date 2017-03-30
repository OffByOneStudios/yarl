import React from 'react';

import Documentable from '../../../configure/libs/documentable';
import Routable from '../../../configure/libs/routable';
import Testable from '../../../configure/libs/testable';
import Tagable from '../../../configure/libs/tagable';
import Typable from '../../../configure/libs/typable';

import {connect} from 'react-redux';

const $d = (actionType) => {
  return window.Context.Store.dispatch(actionType);
}
const $a = (actionName) => {
  return window.Context.Actions[actionName];
}


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
@Routable("emptyComponent", {
  displayName: "Empty Component",
  description: "This Component Left Intentionally Blank"
})
class EmptyComponent extends React.Component {
  static propTypes = {

  }

  render() {

    return (
      <div className="container">
        <div className="hoverable" onClick={() => {$d($a("backNav")())}}>
          Back
        </div>
      </div>
    );
  }
}

export default EmptyComponent;
