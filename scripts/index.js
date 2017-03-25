
import reindexDirectory from './reindexDirectory';
import program from 'commander';


program.command("generate <kind> <module_name> <name>")
  .action((kind, module_name, name, options) => {
     console.log(kind, module_name, name, options);
  });


function main() {
  console.log(program.parse(process.argv));
}

main();
