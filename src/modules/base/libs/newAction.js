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
  return `Documentable({
      text: \`# ${name}\`,
      args: {${sArgs}}
  }),`;
}

function asyncActionBody(args, post=false) {
  const sArgs = `${args.join('    \n')}`;

  return `
  return (dispatch, getState) => {
    dispatch({
      type: this.type
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
  const sArgs = `${args.join('    \n')}`;
  return `
  return {
    type: this.type,
    ${sArgs}
  }
  `;
}

function asyncReducer(functionName, args, moduleName) {
  return `
  Reducable((state, action) => {
    return {
      ...state,
      ${moduleName}: {
        ...state.${moduleName},
        loading: action.data,
        query: action.query,
        data: action.data,
        error: action.error
      }
    }
`
}

function reducer(functionName, args, moduleName) {
  return `
  Reducable((state, action) => {
    return {
      ...state,
      ${moduleName}: {
        ...state.app.${moduleName},
        loading: action.data,
        query: action.query,
        data: action.data,
        error: action.error
      }
    }
`
}

async function newAction(moduleName, actionName, actionArgs, actionOptions) {

  if(!await fs.exists(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(await fs.exists(path.join(process.cwd(), `src/modules/${moduleName}/actions/${functionName}.js`)))
  {
    console.error(`Action ${actionName} Already Exists In ${moduleName}`);
    return;
  }

  const outfile = path.join(process.cwd(), `src/modules/${moduleName}/actions/${functionName}.js`);
  const yarlPath = (command.yarl) ? '../../..': '@offbyonestudios/yarl';

  await fs.writeFile(outfile, `'use babel'
import {compose} from 'redux';
import 'whatwg-fetch';
import Reducable from '${yarlPath}/configure/libs/reducable';
${(command.documentable) ? `import Documentable from '${yarlPath}/configure/libs/documentable'`: ''}
${(command.tagable) ? `import Tagable from '${yarlPath}/configure/libs/tagable'`: ''}

function ${functionName}(${functionArgs.join(",")}) {
  ${(actionOptions.async) ? asyncActionBody(actionArgs): actionBody(actionArgs)}
}

export default compose (
  ${(command.documentable) ? `${useDocumentable(functionName, functionArgs)}` : ''}
  ${(command.tagable) ? (useTagable(functionName)): ''}
)(${functionName});
`);

  await regenerateIndex(path.join(process.cwd(), `src/modules/${moduleName}/libs/`));
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
