'use babel'
import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';
import casual from 'casual-browserify';

import Documentable from '../../../configure/libs/documentable'
import Routable from '../../../configure/libs/routable';
import Tagable from '../../../configure/libs/tagable'
import Typable from '../../../configure/libs/typable'
import baseRenderByPropType from '../libs/baseRenderByPropType'

@Documentable({
  text: `# testIt`,
  args: {
    foo: '{number} foo',
    bar: '{object} bar',
    baz: '{string} baz',
    bing: '{func} bing'
  }
})
@Tagable({platform: 'any'})
@Typable("testIt")
@Routable('testIt', {
  displayName: 'TestIt',
  description: 'This is a Test of the automated Component Generation System'
})
@connect((state, ownProps) => {
    return {
      testIt: state.app.base.testIt
    };
})
class testIt extends Component {
  static propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.object,
    baz: PropTypes.string,
    bing: PropTypes.func
  }
  static defaultProps = {
    foo: casual.integer(),
    bar: casual.array_of_digits().reduce((st, it)=>{st[casual.word] = it; return st;}, {}),
    baz: casual.string,
    bing: ()=> {console.log('Empty Function')}
  }

  render() {
    const body = baseRenderByPropType('base', 'testIt', this.props, testIt.propTypes);
    return (
      <div>
        <h3>testIt</h3>
        {body}
      </div>
    );
  }
}
