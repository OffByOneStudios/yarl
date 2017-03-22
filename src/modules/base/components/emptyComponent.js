import React from 'react';
import {Documentable, Routable, Testable, Tagable, Typable} from '../../../configure/decorators';
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
@Routable("emptyComponent")
class EmptyComponent extends React.PureComponent {
  static propTypes = {

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="column">.column</div>
          <div className="column">.column</div>
          <div className="column">.column</div>
          <div className="column">.column</div>
        </div>

        <div className="row">
          <div className="column">.column</div>
          <div className="column column-50 column-offset-25">.column column-50 column-offset-25</div>
        </div>

      </div>
    );
  }
}

export default EmptyComponent;
