
'use babel'
import Documentable from '../../../configure/libs/documentable';

function regenerateIndex(directory) {
  const fs = require('fs');
  const items = fs.readdirSync(directory).filter((e) => {return e !== '.DS_Store' && e !== 'index.js';});
  const _imports = items.map((e) => { return `import ${e.split('.')[0]} from './${e}';`;});
  const _exports = items.map((e) => { return `  ${e.split('.')[0]},`});
  return fs.writeFile(
    `${directory}/index.js`,
    `${_imports.join('\n')}\nexport default {\n${_exports.join('\n')}\n};\n`
  );
}
export default Documentable({
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
})(regenerateIndex)
