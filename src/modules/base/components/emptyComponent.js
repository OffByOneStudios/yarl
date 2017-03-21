import React from 'react';
import {Documentable} from '../../../configure/decorators/documentable';
import {connect} from 'react-redux';

class EmptyComponent extends React.Component {
  static propTypes = {

  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="column">.column</div>
          <div class="column">.column</div>
          <div class="column">.column</div>
          <div class="column">.column</div>
        </div>

        <div class="row">
          <div class="column">.column</div>
          <div class="column column-50 column-offset-25">.column column-50 column-offset-25</div>
        </div>

      </div>
    );
  }
}

Documentable(EmptyComponent, {
  text:
  `
  This Component is Left Intentionally Blank
  `,
  propTypes: {
    foo: `AThing`
  }
})


export default EmptyComponent;
