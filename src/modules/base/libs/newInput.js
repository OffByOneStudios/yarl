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

function splitFieldTypes(fieldTypes) {
  return fieldTypes.map((e)=> {
    const things = e.split(":");
    return {
      name: things[0],
      type: things[1]
    }
  })
}

async function newInput(moduleName, inputName, fieldTypes) {
  try
  {
    const mod = await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}`));
  }
  catch(e)
  {
    console.error(`No Such Module ${moduleName}`);
  }
  if(!fieldTypes.length) {
    console.error(`Inputs must have at least one field`);
  }
  let input = Context.GraphQL._typeMap[inputName];
  if(input !== undefined) {
    console.error(`Input: ${inputName} Already Exists`);
    return
  }

  const fields = splitFieldTypes(fieldTypes);
  for(let i = 0; i < fields.length; i++ ) {
    let typ = Context.GraphQL._typeMap[fields[i].type.replace(/[\[\]!]/g, "")];
    if(typ === undefined) {
      console.error(`Field ${fields[i].name}'s type '${fields[i].type}' does not exist in Schema'`);
      return;
    }
    if(typ.constructor.name === 'GraphQLObjectType') {
      console.error(`Field: '${fields[i].name}' Must be either Scalar or InputType, not ObjectType`);
      return;
    }
  }

  await fs.writeFileAsync(
    path.join(process.cwd(),`src/modules/${moduleName}/model/inputs/${inputName.toLowerCase()}.js`),
`export default \`
input ${inputName} {
  ${fieldTypes.join("\n  ")}
}
\`;
`.replace("\n\n", "\n"));

  await regenerateIndex(path.join(process.cwd(),`src/modules/${moduleName}/model/inputs`));
}

export default compose (
  Documentable({
  text: `# newInput`,
  args: {
    moduleName: 'Name of Module',
    inputName: 'Name of Input',
    fieldTypes: 'fields on this Input'
  }
}),
  Commandable((program) => {
  program
    .command('newInput <moduleName> <InputName> [fieldTypes...]' )
    .description('Create a new GraphQL Input')
    .action(newInput);
}),
  Tagable({platform: 'any'})
)(newInput);
