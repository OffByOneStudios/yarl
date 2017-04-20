'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import setJsonPath from './setJsonPath';

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

const contentTypes = [
  "action",
  "component",
  "lib",
];


function parseFromDocumentable(comp, fields) {
  let start = 0;
  let end = 0;
  for(let i = 0; i < comp.length; i++)
  {
    const e = comp[i];
    if(e === '(') {
      start = i;
    }
    else if(e === ')') {
      end = i;
      break;
    }
  }

  let docString;
  eval(`docString=${comp.slice(start + 1, end)}`);
  Object.keys(fields).map((e, i) => {
    const f = fields[e].split(":");
    setJsonPath(docString, f[0], f[1]);
  });

  return `${comp.slice(0, start + 1)}${JSON.stringify(docString, undefined, 2)}${comp.slice(end)}`;
}


async function updateDocs(moduleName, contentType, resourceName, fields) {
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
      let mp = data.lastIndexOf("Documentable");
      if(mp === -1) {
        throw "Target File Does not have a Documentable Decorator"
      }
      let newEnd = parseFromDocumentable(data.slice(mp), fields);
      await fs.writeFileAsync(filePath, `${data.slice(0, mp)}${newEnd}`);
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
  "text": "Testing this update",
  "args": {
    "moduleName": "Name of Module to Use",
    "contentType": "Arg 1",
    "resourceName": "Arg 2",
    "fields": "Arg 3"
  }
}),
  Commandable((program) => {
  program
    .command('updateDocs <moduleName> <resourceType> <resourceName> [fields...]' )
    .description('Invoke updateDocs')
    .action(updateDocs);
}),


)(updateDocs);
