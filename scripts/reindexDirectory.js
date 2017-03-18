import fs from 'fs';

export default function(directory) {
  const items = fs.readdirSync(directory).filter((e) => {return e !== '.DS_Store' && e !== 'index.js';});
    const _imports = items.map((e) => { return `import ${e.split('.')[0]} from './${e}';`;});
    const _exports = items.map((e) => { return `  ${e.split('.')[0]},`});
    fs.writeFileSync(
      `${directory}/index.js`,
      `${_imports.join('\n')}\nexport default {\n${_exports.join('\n')}\n};\n`
    );
};
