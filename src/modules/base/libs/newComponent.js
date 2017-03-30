'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

let fs, path;
if(!YARL_BROWSER) {
  fs = require('fs');
  path = require('path');
}

function useDocumentable(name, args=[]) {
  const sArgs = args.map((e, i) => {
    return `${e}: 'Arg ${i}'`;
  }).join(',\n');
  return `@Documentable({
      text: \`# ${name}\`,
      args: {${sArgs}}
  }),`;
}

function renderPropTypesStubs(propTypes) {
  const items = Object.keys(propTypes).map((e, i) => {
    return (

    );
  });
  return (

  );
}

function newComponent(moduleName, componentName, propTypes, options) {
  if(!fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}/components/${functionName}.js`)))
  {
    console.error(`Component ${componentName} Already Exists In ${moduleName}`);
    return;
  }

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/components/${functionName}.js`);
  const yarlPath = (command.yarl) ? '../../..': '@offbyonestudios/yarl';
  fs.writeFileSync(outfile, `'use babel'
import React, {Component, PropTypes} from 'react';

${(command.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable'`: ''}
${(command.commandable) ? `import Commandable from '${yarlPath}/configure/libs/commandable'`: ''}
${(command.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable'`: ''}

function ${functionName}(${functionArgs.join(",")}) {
  console.log('${functionName}')
}

class ${componentName} extends Component {
  static propTypes = {

  }
  
  render() {
    return (
      <div>
        <h1>${componentName}</h1>

      </div>
    );
  }
}
`);
}

export default compose (
  Documentable({
      text: `# newComponent`,
      args: {
        moduleName: 'string name of module',
        componentName: 'string name of component',
        propTypes: 'list of <name>:<type> pairs',
        options: 'object of boolean options'
      }
  }),
  Commandable((program) => {
    program
      .command('newComponent <moduleName> <componentName> [propTypes...]' )
      .description('Generate A New Component')
      .action(newComponent);
  }),
  Tagable({platform: 'any'})
)(newComponent);
