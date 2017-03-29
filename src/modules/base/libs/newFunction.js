'use babel'
import {compose} from 'redux';

import Documentable from '../../../configure/libs/documentable';
import Commandable from '../../../configure/libs/commandable';
import Testable from '../../../configure/libs/testable';
import Tagable from '../../../configure/libs/tagable';

import regenerateIndex from './regenerateIndex';

let fs, path;
if(!YARL_BROWSER) {
  fs = require('fs');
  path = require('path');
}

function useDocumentable(name, args=[]) {
  const sArgs = args.map((e, i) => {
    return `${e}: 'Arg ${i}'`;
  }).join(',\n');
  return `Documentable({
      text: \`# ${name}\`,
      args: {${sArgs}}
  }),`;
}

function useCommandable(name, args=[]) {
  const sArgs = args.map((e, i) => {
    return `<${e}>`;
  }).join(' ');

  return `Commandable((program) => {
    program
      .command('${name} ${sArgs}' )
      .description('Invoke ${name}')
      .action(${name});
  }),`;
}

function useTagable(name) {
  return `Tagable({platform: 'any'})`;
}

function newFunction(moduleName, functionName, functionArgs, command) {

  if(!fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}/libs/${functionName}.js`)))
  {
    console.error(`Function ${functionName} Already Exists In ${moduleName}`);
    return;
  }

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/libs/${functionName}.js`);
  const yarlPath = (command.yarl) ? '../../..': '@offbyonestudios/yarl';

  fs.writeFileSync(outfile, `'use babel'
import {compose} from 'redux';
${(command.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable'`: ''}
${(command.commandable) ? `import Commandable from '${yarlPath}/configure/libs/commandable'`: ''}
${(command.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable'`: ''}

function ${functionName}(${functionArgs.join(",")}) {
  console.log('${functionName}')
}

export default compose (
  ${(command.documentable) ? `${useDocumentable(functionName, functionArgs)}` : ''}
  ${(command.commandable) ? (useCommandable(functionName, functionArgs)) : ''}
  ${(command.tagable) ? (useTagable(functionName)): ''}
)(${functionName});
`);

  regenerateIndex(path.join(process.cwd(), `src/modules/${moduleName}/libs/`));
}

export default compose(
  Commandable((program) => {
    program
      .command('newFunction <moduleName> <functionName> [functionArgs...]')
      .option('-d, --documentable', 'Add Documentable Decorator')
      .option('-c, --commandable', 'Add Commandable Decorator')
      .option('-t, --tagable', 'Add Tagable Decorator')
      .option('-y, --yarl', 'Generate inside the yarl Package')
      .description('Create a new function')
      .action(newFunction);
  }),
  Documentable({
    text: `# newFunction
`})
)(newFunction)
