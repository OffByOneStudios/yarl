'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable';
import Commandable from '../../../configure/libs/commandable';

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

import regenerateIndex from './regenerateIndex';

const contentTypes = [
  "action",
  "component",
  "lib",
  "input",
  "type",
  "mutation",
  "query",
  "style"
];


async function deleteItem(moduleName, contentType, resourceName) {
  const modulePath = path.join(process.cwd(), `src/modules/${moduleName}`);
  try
  {
    const mod = await fs.statAsync(modulePath);
  }
  catch(e)
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(!contentTypes.includes(contentType))
  {
    console.error(`No Such Content Type: ${contentType}`);
    return;
  }

  if(["query", "mutation"].includes(contentType))
  {
    const filePath = `${modulePath}/model/${(contentType==='query')? 'queries': 'mutations'}.js`;
    try {
      const data = await fs.readFileAsync(filePath).split("\n").filter((e) => {
        return e.substring(0, e.indexOf("(")) === resourceName;
      }).join("\n  ");
      await fs.writeFileAsync(filePath, `export default \`\n  ${data}\n\`;\n`);

    }
    catch (e) {
      console.error(`Module ${moduleName} is missing its ${contentType} file`);
      return;
    }
  }
  else {
    let subPath = (["input", "type"].includes(contentType)) ?
      `model/${(contentType === 'input') ? 'inputs': 'types'}` :
      `${contentType}s`;

    try {
      await fs.unlinkAsync(`${modulePath}/${subPath}/${resourceName}.js`);
      await regenerateIndex(`${modulePath}/${subPath}`);
    }
    catch (e) {
      console.error(`No Such ${contentType} ${resourceName} in Module ${moduleName}`);
      return;
    }
  }
}

export default compose (
  Documentable({
  text: `# deleteItem`,
  args: {
    moduleName: 'Arg 0',
    contentType: 'Arg 1',
    resourceName: 'Arg 2'
  }
}),
  Commandable((program) => {
  program
    .command('deleteItem <moduleName> <contentType> <resourceName>' )
    .description('Delete A Resource')
    .action(deleteItem);
}),
)(deleteItem);
