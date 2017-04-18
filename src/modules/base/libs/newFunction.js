'use babel'
import {compose} from 'redux';

import Documentable from '../../../configure/libs/documentable';
import Commandable from '../../../configure/libs/commandable';
import Testable from '../../../configure/libs/testable';
import Tagable from '../../../configure/libs/tagable';

import regenerateIndex from './regenerateIndex';


let fs, path;
if(!YARL_BROWSER) {
  let bluebird = require("bluebird");
  fs = bluebird.promisifyAll(require('fs'));
  path = require('path');
}

function useDocumentable(name, args=[]) {
  const sArgs = args.map((e, i) => {
    return `${e}: 'Arg ${i}'`;
  }).join(',\n    ');
  return `Documentable({
    text: \`# ${name}\`,
    args: {
      ${sArgs}
    }
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

function useResolvable(functionName, command) {
  const s = (command.mutative) ? 'Mutation': 'Query';
  return `Resolvable('${s}.${functionName}')`;
}

function getBody(functionName, command) {
  if(command.promise) {
    return `return new Promise((resolve, reject) => {resolve({})});`;
  }
  else {
    return `console.log(functionName)`;
  }
}

async function newFunction(moduleName, functionName, functionArgs, command) {
  try
  {
    const mod = await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}`));
  }
  catch(e)
  {
    console.error(`No Such Module ${moduleName}`);
  }
  try
  {
    await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}/libs/${functionName}.js`));
    console.error(`Function ${functionName} Already Exists In ${moduleName}`);
    return;
  }
  catch (e) {}

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/libs/${functionName}.js`);
  const yarlPath = (command.yarl) ? '../../..': '@offbyonestudios/yarl';
  const async = command.commandable|| command.asyc || command.resolvable;

  await fs.writeFileAsync(outfile, `'use babel'
import {compose} from 'redux';
${(command.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable'`: ''}
${(command.commandable) ? `import Commandable from '${yarlPath}/configure/libs/commandable'`: ''}
${(command.resolvable) ? `import Resolvable from '${yarlPath}/configure/libs/resolvable'`: ''}
${(command.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable'`: ''}

${(async) ? "async ": ""}function ${functionName}(${functionArgs.join(",")}) {
  ${getBody(functionName, command)}
}

export default compose (
  ${(command.documentable) ? `${useDocumentable(functionName, functionArgs)}` : ''}
  ${(command.commandable) ? (useCommandable(functionName, functionArgs)) : ''}
  ${(command.resolvable) ? (useResolvable(functionName, command)) : ''}
  ${(command.tagable) ? (useTagable(functionName)): ''}
)(${functionName});
`);

  await regenerateIndex(path.join(process.cwd(), `src/modules/${moduleName}/libs/`));
}

export default compose(
  Commandable((program) => {
    program
      .command('newFunction <moduleName> <functionName> [functionArgs...]')
      .option('-d, --documentable', 'Add Documentable Decorator')
      .option('-c, --commandable', 'Add Commandable Decorator')
      .option('-t, --tagable', 'Add Tagable Decorator')
      .option('-r, --resolvable', 'Add Resolvable Decorator')
      .option('-a, --async', 'Scaffold function as async (True iff -[arc])')
      .option('-y, --yarl', 'Generate inside the yarl Package')
      .description('Create a new function')
      .action(newFunction);
  }),
  Documentable({
    text: `# newFunction
`})
)(newFunction)
