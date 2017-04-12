'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

import regenerateIndex from './regenerateIndex';

let fs, path;
if(!YARL_BROWSER) {
  fs = require('fs');
  path = require('path');
}

function newModule(moduleName) {

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

  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/model`));
  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/model/inputs`));
  regenerateIndex(`${modulesPath}/${moduleName}/model/inputs`);
  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/model/types`));
  regenerateIndex(`${modulesPath}/${moduleName}/model/types`);

  fs.writeFileSync(`${modulesPath}/${moduleName}/model/mutations.js`, `
'use babel'
export default \`
\`;
`);

  fs.writeFileSync(`${modulesPath}/${moduleName}/model/queries.js`, `
'use babel'
export default \`
\`;
`);

  regenerateIndex(`${modulesPath}/${moduleName}/model`);

  fs.mkdirSync(path.normalize(`${modulesPath}/${moduleName}/styles/`));
  regenerateIndex(`${modulesPath}/${moduleName}/styles`);

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
