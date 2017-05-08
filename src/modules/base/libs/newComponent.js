'use babel'
import {compose} from 'redux';
import React from 'react';

import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

import casualByPropTypeString from './casualByPropTypeString';
import regenerateIndex from './regenerateIndex';

let fs, path;
if(!YARL_BROWSER) {
  let bluebird = require("bluebird");
  fs = bluebird.promisifyAll(require('fs'));
  path = require('path');
}

function useDocumentable(name, args=[]) {
  const sArgs = args.map((e, i) => {
    const sp = e.split(":");
    return `${sp[0]}: '{${sp[1]}}'`;
  }).join(',\n    ');
  return `@Documentable({
  text: \`# ${name}\`,
  args: {
    ${sArgs}
  }
})`;
}

function useConnectable(moduleName, componentName) {
  return `@connect((state) => {
  return {
    ...state.app.${moduleName}.${componentName}
  };
})`
}

function useTagable(propTypes) {
  return `@Tagable({platform: 'any'})`;
}

function useRoutable(componentName, propTypes) {
  return `@Routable('${componentName}', {
  displayName: '',
  description: ''
})`;
}

function expandPropTypes(pairList) {
  return pairList.map((e, i) => {
    const s = e.split(":");
    return `${s[0]}: PropTypes.${s[1]}`;
  }).join(",\n    ");
}

function expandDefaultProps(pairList) {
  return pairList.map((e, i) => {
    const s = e.split(":");
    if(React.PropTypes[s[1]] === undefined) {
      throw `Invalid React PropType: ${s[0]}`
    }
    return `${s[0]}: ${casualByPropTypeString(s[1])}`;
  }).join(",\n    ");
}

async function newComponent(moduleName, componentName, propTypes, options) {
  try
  {
    const mod = await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}`));
  }
  catch(e)
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  try
  {
    await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}/libs/${componentName}.js`));
    console.error(`Component ${componentName} Already Exists In ${moduleName}`);
    return;
  }
  catch (e) {}

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/components/${componentName}.js`);
  const yarlPath = (options.yarl) ? '../../..': '@offbyonestudios/yarl';
  await fs.writeFileAsync(outfile, `'use babel'
import React, {Component, PropTypes} from 'react';

${(options.connectable) ? `import {connect} from 'react-redux';`: ''}
import casual from 'casual-browserify';

${(options.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable';`: ''}
${(options.routable) ? `import Routable from '${yarlPath}/configure/libs/routable';`: ''}
${(options.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable';`: ''}
${(options.typable) ? `import Typable from '${yarlPath}/configure/libs/typable';`: ''}

import baseRenderByPropType from '${yarlPath}/modules/base/libs/baseRenderByPropType';

${(options.tagable) ? `${useTagable(componentName)}` : ''}
${(options.typable) ? `@Typable("${componentName}")` : ''}
${(options.routable) ? `${useRoutable(componentName)}` : ''}
${(options.connectable) ? `${useConnectable(moduleName, componentName)}` : ''}
${(options.documentable) ? `${useDocumentable(componentName, propTypes)}` : ''}
class ${componentName} extends Component {
  static propTypes = {
    ${expandPropTypes(propTypes)}
  }
  static defaultProps = {
    ${expandDefaultProps(propTypes)}
  }

  render() {
    const body = baseRenderByPropType('${moduleName}', '${componentName}', this.props, ${componentName}.propTypes);
    return (
      {body}
    );
  }
}
export default ${componentName}
`);
  await regenerateIndex(path.join(process.cwd(), `src/modules/${moduleName}/components/`));
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
      .option('-d, --documentable', 'Add Documentable Decorator')
      .option('-c, --connectable', 'Add Redux Connect Decorator')
      .option('-r, --routable', 'Add Routable Decorator')
      .option('-g, --typable', 'Add Typable Decorator')
      .option('-t, --tagable', 'Add Tagable Decorator')
      .option('-y, --yarl', 'Generate inside the yarl Package')
      .action(newComponent);
  }),
  Tagable({platform: 'any'})
)(newComponent);
