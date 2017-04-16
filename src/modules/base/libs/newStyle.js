'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import Tagable from '../../../configure/libs/tagable'

async function newStyle(moduleName, styleName, propTypes, options) {
  if(! await fs.exists(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(await fs.exists(path.join(process.cwd(), `src/modules/${moduleName}/styles/${styleName}.js`)))
  {
    console.error(`Stylesheet ${styleName} Already Exists In ${moduleName}`);
    return;
  }



}

export default compose (
  Documentable({
  text: `# newStyle`,
  args: {
    moduleName: 'Module for Stylesheet',
    styleName: 'Name of Stylesheet',
    propTypes: 'PropTypes to seed default sheet'
  }
}),
  Commandable((program) => {
  program
    .command('newStyle <moduleName> <styleName> [propTypes...]' )
    .description('Create a new Stylesheet')
    .action(newStyle);
}),

  Tagable({platform: 'any'})
)(newStyle);
