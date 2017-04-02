'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'
import Tagable from '../../../configure/libs/tagable'

let fs, path;

if(!YARL_BROWSER) {
  const fs = require('fs');
  const path = require('path');
}
function newQuery(moduleName, queryName, returnType, argTypes) {

  if(!fs.existsSync(path.join(process.cwd(), `src/modules/${moduleName}`)))
  {
    console.error(`No Such Module ${moduleName}`);
    return;
  }

  const queryFile = fs.readFileSync(path.join(process.cwd(), `src/modules/${moduleName}/model/queries.js`)).toString();
  console.log(queryFile.split("\n"));
  for (let q = 0; q < queries.length; q++) {
    if(queries[q].includes(queryName)) {
      console.error(`Query ${queryName} already exists in module ${moduleName}`);
      return;
    }
  }


}

export default compose (
  Documentable({
  text: `# newQuery
Generate a New GraphQL Query
`,
  args: {
    moduleName: 'Name of Module',
    queryName: 'Name of Query',
    returnType: 'Type of Return. Required',
    argTypes: 'Option Arguments to pass to query, in argName:Type pairs'
  }
}),
  Commandable((program) => {
  program
    .command('newQuery <moduleName> <queryName> <returnType> [argTypes...]' )
    .description('Create a New GraphQL Query')
    .action(newQuery);
}),
  Tagable({platform: 'any'})
)(newQuery);
