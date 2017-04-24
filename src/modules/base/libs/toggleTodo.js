'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jsonpath from 'jsonpath';
import repl from 'repl';
import * as babel from 'babel-core';
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


function rebuildTodo(state, value) {
  return `//TODO(${state}) ${value}`
}
async function toggleTodo(moduleName, contentType, resourceName, index) {
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
        ],
        "plugins": [
           "syntax-decorators",
           "syntax-class-properties",
        ]
      });

      const todos = jsonpath.query(parse, "$.ast.comments")[0].filter((e) => {
        return e.value.includes("TODO");
      });
      if (todos.length < index) {
        throw "Invalid Todo Index"
      }
      else {
        const m = todoRE.exec(todos[index].value);
        const b = (m[1] === "true") ? false : true;
        const res = `${data.slice(0, todos[index].start)}${rebuildTodo(b, m[2])}${data.slice(todos[index].end)}`
        await fs.writeFileAsync(filePath, res);
        return b;
      }
    }
    catch (e) {
      return {error: e};
    }
  }
  catch (e){
    console.log(e);
    return {error: `No Such ${contentType} ${resourceName} in Module ${moduleName}`};
  }
}

export default compose (
  Documentable({
    text: `# decoratorsFor`,
    args: {
      moduleName: 'Arg 0',
      contentType: 'Arg 1',
      resourceName: 'Arg 2',
      index: ''
    }
  }),
  Commandable((program) => {
  program
    .command('toggleTodo <moduleName> <resourceType> <resourceName> <index>' )
    .description('Invoke updateDocs')
    .action((moduleName,contentType,resourceName, index) =>
    {
      toggleTodo(moduleName,contentType,resourceName, index)
        .then((e) => console.log(e))
    });
  }),
)(toggleTodo);
