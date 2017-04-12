
'use babel'
import {compose} from 'redux';
import Commandable from '../../../configure/libs/commandable'
import Documentable from '../../../configure/libs/documentable';

let fs, path;
if(!YARL_BROWSER) {
  fs = require('fs');
  path = require('path');
}

function importByFileName(item) {
  const parts = item.split(".");
  const ext = parts[parts.length -1];
  if (ext === "css") {
    return `import './${item}';`;
  }
  else {
    return `import ${parts[0]} from './${item}';`;
  }
}

function regenerateIndex(directory) {
  const items = fs.readdirSync(directory).filter((e) => {return e !== '.DS_Store' && e !== 'index.js';});
  const _imports = items.map((e) => { return importByFileName(e)});
  const _exports = items.map((e) => { return `${e.split('.')[0]}`});
  return fs.writeFile(
    `${directory}/index.js`,
    `${_imports.join('\n')}\nexport default {\n  ${_exports.join(',\n  ')}\n};\n`
  );
}
export default compose(
  Commandable((program) => {
    program
      .command('regenerateIndex <path>')
      .description('Regenerate the index.js file of a directory')
      .action(regenerateIndex);
  }),
  Documentable({
  text: `
# regenerateIndex
Given a directory, ouput an index.js file of the form:

\`\`\`js
import foo from './foo';
import bar from './bar';

export default {
  foo,
  bar
}
\`\`\`
This pattern is used throughout Yarl to auto import code
`,
  args: {
    directory: `Directory to Regenerate`
  }
  })
)(regenerateIndex)
