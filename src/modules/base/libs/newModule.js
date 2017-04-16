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

async function newModule(moduleName) {

  const modulesPath = path.join(process.cwd(), `src/modules`);
  try
  {
    const mod = await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}`));
    console.error(`Module already exists ${moduleName}`);
  }
  catch(e)
  {

  }
  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}`));

  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/actions`));
  await regenerateIndex(path.normalize(`${modulesPath}/${moduleName}/actions`));

  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/components`));
  await regenerateIndex(path.normalize(`${modulesPath}/${moduleName}/components`));

  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/libs`));
  await fs.writeFileAsync(path.normalize(`${modulesPath}/${moduleName}/libs/constants.js`), `
'use babel'
export default {

};
  `);
  await regenerateIndex(`${modulesPath}/${moduleName}/libs`);

  await fs.writeFileAsync(`${modulesPath}/${moduleName}/defaultState.js`, `
'use babel'
export default {

};
  `);

  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/model`));
  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/model/inputs`));
  await regenerateIndex(`${modulesPath}/${moduleName}/model/inputs`);
  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/model/types`));
  await regenerateIndex(`${modulesPath}/${moduleName}/model/types`);

  await fs.writeFileAsync(`${modulesPath}/${moduleName}/model/mutations.js`, `
'use babel'
export default \`
\`;
`);

  await fs.writeFileAsync(`${modulesPath}/${moduleName}/model/queries.js`, `
'use babel'
export default \`
\`;
`);

  await regenerateIndex(`${modulesPath}/${moduleName}/model`);

  await fs.mkdirAsync(path.normalize(`${modulesPath}/${moduleName}/styles/`));
  await regenerateIndex(`${modulesPath}/${moduleName}/styles`);

  await regenerateIndex(`${modulesPath}/${moduleName}`);

  await regenerateIndex(modulesPath);
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
