'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jsonpath from 'jsonpath';
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

function rebuildTodo(value) {
  return ` //TODO(false) ${value}\n`
}


async function addTodo(moduleName, contentType, resourceName, todoText) {
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
      const q = "$.ast.program.body[?(@.type === 'FunctionDeclaration')]";
      const body = jsonpath.query(parse, q)
        .filter(e => {return  e.id.name === resourceName})[0].body;

      await fs.writeFileAsync(filePath,
      data.slice(0, body.start + 3) + rebuildTodo(todoText) + data.slice(body.start + 2))
      return true;
    }
    catch (e) {
      console.log(e);
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
    text: `# addTodo`,
    args: {
      moduleName: 'Arg 0',
      resourceType: 'Arg 1',
      resourceName: 'Arg 2',
      todoText: 'Arg 3'
    }
  }),
  Commandable((program) => {
  program
    .command('addTodo <moduleName> <resourceType> <resourceName> <todoText>' )
    .description('Add a TODO to a resource')
    .action(addTodo);
}),


)(addTodo);
