'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jsonpath from 'jsonpath';
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

async function decoratorsFor(moduleName,contentType,resourceName) {
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

      const tmp = jsonpath.query(parse, "$.ast.program.body[?(@.type === 'ExportDefaultDeclaration')]")[0];
      if(contentType === 'component') {
        return jsonpath.query(tmp, "$.declaration.decorators")[0].map((e) => {
          return e.expression.callee.name;
        });
      }
      else {
        return jsonpath.query(tmp, "$.declaration.callee.arguments")[0].map((e, i) => {
          return e.callee.name;
        });
      }
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
    .command('decoratorsFor <moduleName> <resourceType> <resourceName>' )
    .description('Invoke updateDocs')
    .action((moduleName,contentType,resourceName) =>
    {
      decoratorsFor(moduleName,contentType,resourceName)
        .then((e) => console.log(e))
    });
  }),
)(decoratorsFor);
