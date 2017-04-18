'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

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

function asyncActionBody(args, post=false) {
  const sArgs = `${args.join(',\n        ')}`;

  return `
  return (dispatch, getState) => {
    dispatch({
      type: this.type,
      loading: true,
      data: undefined,
      error: undefined,
      query: {
        ${sArgs}
      }
    });
    fetch('http://localhost:3020', {
      method: ${(post) ? 'POST': 'GET'},
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    }).then((response) => {
        return response.json()
      }).then((json) => {
        dispatch({
          type: this.type,
          loading: false,
          data: json,
        });
      }).catch((ex) => {
        dispatch({
          type: this.type,
          data: undefined,
          loading: false,
          error: ex,
        });
      })
  }
`
}

function actionBody(args) {
  const sArgs = `${args.join(',\n      ')}`;
  return `
  return {
    type: this.type,
    data:{
      ${sArgs}
    }
  }
  `;
}

function asyncReducer(actionName, args, moduleName) {
  return `
  Reducable((state, action) => {
    return {
      ...state,
      ${moduleName}: {
        ...state.${moduleName},
        ${actionName}: {
          ...state.${moduleName}.${actionName},
          ...action.data
        }
      }
    }
  }),
`
}

function reducer(actionName, args, moduleName) {
  return `
  Reducable((state, action) => {
    return {
      ...state,
      ${moduleName}: {
        ...state.${moduleName},
        ${actionName}: {
          ...state.${moduleName}.${actionName},
          ...action.data
        }
      }
    }
  }),
`
}

async function newAction(moduleName, actionName, actionArgs, actionOptions) {
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
    await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}/libs/${actionName}.js`));
    console.error(`Component ${actionName} Already Exists In ${moduleName}`);
    return;
  }
  catch (e) {}

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/actions/${actionName}.js`);
  const yarlPath = (actionOptions.yarl) ? '../../..': '@offbyonestudios/yarl';

  await fs.writeFileAsync(outfile, `'use babel'
import {compose} from 'redux';
import 'whatwg-fetch';
import Reducable from '${yarlPath}/configure/libs/reducable';
${(actionOptions.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable'`: ''}
${(actionOptions.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable'`: ''}

function ${actionName}(${actionArgs.join(",")}) {
  ${(actionOptions.async) ? asyncActionBody(actionArgs): actionBody(actionArgs)}
}

export default compose (
  ${(actionOptions.async) ? asyncReducer(actionName, actionArgs, moduleName): reducer(actionName, actionArgs, moduleName)}
  ${(actionOptions.documentable) ? `${useDocumentable(actionName, actionArgs)}` : ''}
  ${(actionOptions.tagable) ? (useTagable(actionName)): ''}
)(${actionName});
`);

  await regenerateIndex(path.join(process.cwd(), `src/modules/${moduleName}/actions/`));
}

export default compose (
  Documentable({
    text: `# newAction`,
    args: {
      moduleName: 'Action for Module',
      actionName: 'camelCase Name of Action',
      actionArgs: 'Argument list of actions',
      actionOptions: 'Flaged Options'
    }
  }),
  Commandable((program) => {
    program
      .command('newAction <moduleName> <actionName> [actionArgs...]' )
      .option('-d, --documentable', 'Add Documentable Decorator')
      .option('-p, --post', 'Send async args in request body')
      .option('-a, --async', 'Action is Async')
      .option('-t, --tagable', 'Add Tagable Decorator')
      .option('-y, --yarl', 'Generate inside the yarl Package')
      .description('Invoke newAction')
      .action(newAction);
  }),
  Tagable({platform: 'any'})
)(newAction);
