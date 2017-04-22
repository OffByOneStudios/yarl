'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jsonpath from 'jsonpath';
import repl from 'repl';
import * as babel from 'babel-core';

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

const contentTypes = [
  "action",
  "component",
  "lib",
];

async function decoratorsFor(moduleName,contentType,resourceName) {
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
    console.error(`Try: ${contentTypes}`);
    return;
  }
  try {
    const filePath = `${modulePath}/${contentType}s/${resourceName}.js`;
    const data = (await fs.readFileAsync(filePath)).toString();
    try {
      const result = babel.transform(data, {code:false});

      repl.start('>').context.args = {
        result: result,
        jsonpath: jsonpath
      }
    }
    catch (e) {
      console.error(e);
      return;
    }
  }
  catch (e){
    console.log(e);
    console.error(`No Such ${contentType} ${resourceName} in Module ${moduleName}`);
    return
  }
}

export default compose (
  Documentable({
    text: `# decoratorsFor`,
    args: {
      moduleName: 'Arg 0',
      contentType: 'Arg 1',
      resourceName: 'Arg 2'
    }
  }),
  Commandable((program) => {
  program
    .command('decoratorsFor <moduleName> <resourceType> <resourceName>' )
    .description('Invoke updateDocs')
    .action(decoratorsFor);
  }),
)(decoratorsFor);
