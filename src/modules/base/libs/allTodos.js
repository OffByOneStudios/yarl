'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'

import Resolvable from '../../../configure/libs/resolvable'


function allTodos(filter) {
  return new Promise((resolve, reject) => {resolve({})});
}

export default compose (
  Documentable({
  text: `# allTodos`,
  args: {
    filter: 'Arg 0'
  }
}),

  Resolvable('Query.allTodos')

)(allTodos);
