'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

import regenerateIndex from './regenerateIndex';

function newModule(moduleName) {
  const fs = require('fs');
  const path = require('path');
  const modulesPath = path.join(process.cwd(), `src/modules`);
  if(fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`Module already exists ${moduleName}`);
    return;
  }
  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}`));

  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/actions`));
  regenerateIndex(path.normalize(`${modulesPath}/${moduleName}/actions`));

  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/components`));
  regenerateIndex(path.normalize(`${modulesPath}/${moduleName}/components`));

  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/libs`));
  fs.writeFileSync(path.normalize(`${modulesPath}/${moduleName}/libs/constants.js`), `
'use babel'
export default {

};
  `);
  regenerateIndex(`${modulesPath}/${moduleName}/libs`);

  fs.writeFileSync(`${modulesPath}/${moduleName}/defaultState.js`, `
'use babel'
export default {

};
  `);
  regenerateIndex(`${modulesPath}/${moduleName}`);

  regenerateIndex(modulesPath);
}

export default compose (
  Documentable({
      text: `# newModule`,
      args: {moduleName: `Name of New Module`}
  }),
  Commandable((program) => {
    program
      .command('newModule <moduleName>  ' )
      .description('Create a new module')
      .action(newModule);
  }),
  Tagable({platform: 'any'})
)(newModule);
