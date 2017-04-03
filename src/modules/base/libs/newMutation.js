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

function splitArgTypes(argTypes) {
  return argTypes.map((e)=> {
    const things = e.split(":");
    return {
      name: things[0],
      type: things[1]
    }
  })
}

function newMutation(moduleName, mutationName, returnType, argTypes) {

  if(!fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }

  const mutationFile = fs.readFileSync(path.join(process.cwd(),
    `src/modules/${moduleName}/model/mutations.js`)).toString();

  const t1 = mutationFile.indexOf('`') + 1;
  const t2 = mutationFile.lastIndexOf('`');

  let mutations = mutationFile.slice(t1, t2).split("\n");
  for (let q = 0; q < mutations.length; q++) {
    if(queries[q].includes(mutationName)) {
      console.error(`Query ${mutationName} already exists in module ${moduleName}`);
      return;
    }
  }

  let ret = Context.GraphQL._typeMap[returnType.replace(/[\[\]!]/g, "")];
  if(ret === undefined) {
    console.error(`Return Type: '${returnType}' does not exist in Schema`);
    return;
  }
  if(ret.constructor.name === 'GraphQLInputObjectType') {
    console.error(`Return Type: '${returnType}' Must be either Scaler or ObjectType, not InputType`);
    return;
  }
  let args = splitArgTypes(argTypes);

  for(let i = 0; i < args.length; i++ ) {
    let typ = Context.GraphQL._typeMap[args[i].type.replace(/[\[\]!]/g, "")];
    if(typ === undefined) {
      console.error(`Argument ${args[i].name}'s type ${args[i].type} does not exist in Schema'`);
      return;
    }
    if(typ.constructor.name === 'GraphQLObjectType') {
      console.error(`Argument ${args[i].name}'s type ${args[i].type} Must be either Scaler or InputType, not ObjectType`);
      return;
    }
  }
  mutations.push(`${mutationName}${args.length ? `(${argTypes})` : ''}: ${returnType}`);

  fs.writeFileSync(
    path.join(process.cwd(),`src/modules/${moduleName}/model/mutations.js`),
`export default \`
${mutations.join("\n")}
\`;
`.replace("\n\n", "\n"));
}

export default compose (
  Documentable({
  text: `# newMutation
Generate a New GraphQL Mutation
`,
  args: {
    moduleName: 'Name of Module',
    mutationName: 'Name of Mutation',
    returnType: 'Type of Return. Required',
    argTypes: 'Option Arguments to pass to Mutation, in argName:Type pairs'
  }
}),
  Commandable((program) => {
  program
    .command('newMutation <moduleName> <mutationName> <returnType> [argTypes...]' )
    .description('Create a New GraphQL Mutation')
    .action(newMutation);
}),
  Tagable({platform: 'any'})
)(newMutation);
