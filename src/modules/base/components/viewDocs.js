'use babel'
import React, {Component, PropTypes} from 'react';


import casual from 'casual-browserify';

import Documentable from '../../../configure/libs/documentable';
import Routable from '../../../configure/libs/routable';



import baseRenderByPropType from '../../../modules/base/libs/baseRenderByPropType';



@Routable('viewDocs', {
  displayName: '',
  description: ''
})
@Documentable({
  text: `# viewDocs`,
  args: {

  }
})
export default class viewDocs extends Component {
  static propTypes = {

  }
  static defaultProps = {

  }

  render() {
    const body = baseRenderByPropType('base', 'viewDocs', this.props, viewDocs.propTypes);
    return body;
  }
}
