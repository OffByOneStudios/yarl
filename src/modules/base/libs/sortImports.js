'use babel'
import jsonpath from 'jsonpath';
import syntaxDecorator from 'babel-plugin-syntax-decorators';
import {compose} from 'redux';

import Commandable from '../../../configure/libs/commandable'
import Documentable from '../../../configure/libs/documentable'

let babel;
if(!YARL_BROWSER) {
  babel = require('babel-core');
}

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

const contentTypes = [
  "action",
  "component",
  "lib",
];


async function sortImports(moduleName,contentType,resourceName) {
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
    let data = (await fs.readFileAsync(filePath)).toString();
    try {
      let parse = babel.transform(data, {
        code: false,
        "presets": [
          "react",
        ],
        "plugins": [
           "syntax-decorators",
           "syntax-class-properties",
        ]
      });
      const q = "$.ast.program.body[?(@.type === 'ImportDeclaration')]";
      let body = jsonpath.query(parse, q)
        .map((e) => {
          return {
            start: e.start,
            end: e.end,
            value: e.source.value
        }});
      //console.log(body.sort((a, b) => {return a.value > b.value}));
      let rows = [];
      for(let i = body.length -1; i > -1; i--)
      {
        rows.push(data.slice(body[i].start, body[i].end));
        data = data.slice(0, body[i].start) + data.slice(body[i].end + 1);
      }

      let start = body[0].start;
      let res = rows.sort().reduce((acc, val) => {
        if(val.includes('from \'.')) acc.self.push(val);
        else acc.vendor.push(val);
        return acc;
      },{vendor: [], self: []} )


      await fs.writeFileAsync(filePath,
      `${data.slice(0, start)}${res.vendor.join('\n')}\n\n${res.self.join('\n')}\n${data.slice(start)}`);
      
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
    text: `# sortImports`,
    args: {
      moduleName: 'Arg 0',
      resourceType: 'Arg 1',
      resourceName: 'Arg 2',
    }
  }),
  Commandable((program) => {
  program
    .command('sortImports <moduleName> <resourceType> <resourceName>' )
    .description('Sort a resources ES6 Imports')
    .action(sortImports);
  })
)(sortImports);
