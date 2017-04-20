'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'




function getJsonPath(target,propPath) {
  console.log(getJsonPath)
}

export default compose (
  Documentable({
    text: `# getJsonPath`,
    args: {
      target: 'Arg 0',
    propPath: 'Arg 1'
    }
  }),
  
  
  
)(getJsonPath);
