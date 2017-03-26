
import Commandable from '../../../configure/libs/commandable';

function emptyUtility() {
  console.log("Empty Utility");
}

export default Commandable((program) => {
  program
    .command('emptyUtility')
    .description('Demonstrate Commander working')
    .action(emptyUtility);
})(emptyUtility);
