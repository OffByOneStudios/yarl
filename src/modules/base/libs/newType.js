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

async function newType(moduleName, typeName, fieldTypes) {
  try
  {
    const mod = await fs.statAsync(path.join(process.cwd(), `src/modules/${moduleName}`));
  }
  catch(e)
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }
  if(!fieldTypes.length) {
    console.error(`Types must have at least one field`);
  }
  let type = Context.GraphQL._typeMap[typeName];
  if(type !== undefined) {
    console.error(`Type:${typeName} Already Exists`);
    return
  }

  const fields = splitFieldTypes(fieldTypes);
  for(let i = 0; i < fields.length; i++ ) {
    let typ = Context.GraphQL._typeMap[fields[i].type.replace(/[\[\]!]/g, "")];
    if(typ === undefined) {
      console.error(`Field ${fields[i].name}'s type ${fields[i].type} does not exist in Schema'`);
      return;
    }
    if(typ.constructor.name === 'GraphQLInputObjectType') {
      console.error(`Field: '${fields[i].name}' Must be either Scalar or ObjectType, not InputType`);
      return;
    }
  }

  await fs.writeFileAsync(
    path.join(process.cwd(),`src/modules/${moduleName}/model/types/${typeName.toLowerCase()}.js`),
`export default \`
type ${typeName} {
  ${fieldTypes.join("\n  ")}
}
\`;
`.replace("\n\n", "\n"));

  await regenerateIndex(path.join(process.cwd(),`src/modules/${moduleName}/model/types`));
}

export default compose (
  Documentable({
  text: `# newType`,
  args: {
    moduleName: 'Name of Module',
    typeName: 'Name of Type',
    fieldTypes: 'fields on this type'
  }
}),
  Commandable((program) => {
  program
    .command('newType <moduleName> <TypeName> [fieldTypes...]' )
    .description('Create a new GraphQL type')
    .action(newType);
}),
  Tagable({platform: 'any'})
)(newType);
