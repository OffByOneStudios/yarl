'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import casual from 'casual-browserify';
import {PropTypes} from 'react';

function casualByPropTypeString(propType) {
  console.log(propType);
  if(casual[propType] !== undefined) {
    return `casual.${propType}()`;
  }
  else if (propType == 'array') {
    return `casual.array_of_digits()`
  }
  else if (propType == 'bool') {
    return `casual.coin_flip`;
  }
  else if(propType === 'func') {
    return `()=>console.log('Empty Function')`;
  }
  else if(propType === 'string') {
    return 'casual.sentence';
  }
  else if(propType === 'number') {
    return 'casual.integer';
  }
  else if(propType === 'object') {
    return 'casual.array_of_digits.reduce((st, it)=>{st[casual.word] = it; return st;}, {})';
  }
  else {
    return 'casual.random';
  }
}

export default compose (
  Documentable({
  text: `# casualByPropType`,
  args: {
    propType: 'Arg 0'
  }
}),


)(casualByPropTypeString);
