'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jsonpath from 'jsonpath';
let babel;
if(!YARL_BROWSER) {
  babel = require('babel-core');
}
import syntaxDecorator from 'babel-plugin-syntax-decorators';

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

const contentTypes = [
  "action",
  "component",
  "lib",
];

const todoRE = /TODO ?\((true|false)\) ?([\w ]+)/;

async function todosFor(moduleName, contentType, resourceName) {
  //TODO(false) Clean This Up
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
      const parse = babel.transform(data, {
        code: false,
        "presets": [
          "react",
          // "latest",
          // //"stage-0"
        ],
        "plugins": [
           "syntax-decorators",
        //   // "transform-decorators-legacy",
           "syntax-class-properties",
        //   // // "syntax-dynamic-import",
        ]
      });

      return jsonpath.query(parse, "$.ast.comments")[0].filter((e) => {
        return e.value.includes("TODO");
      }).map((e) => {
        const m = todoRE.exec(e.value);
        return {
          done: m[1],
          text: m[2]
        };
      });
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
    .command('todosFor <moduleName> <resourceType> <resourceName>' )
    .description('Invoke updateDocs')
    .action((moduleName,contentType,resourceName) =>
    {
      todosFor(moduleName,contentType,resourceName)
        .then((e) => console.log(e))
    });
  }),
)(todosFor);
