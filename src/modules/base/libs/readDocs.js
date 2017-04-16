'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'



async function readDocs(docName) {
  const doc = Context.Documents[docName];
  if(doc)
  {
    console.log(docName);
    console.log("Description", "\n");
    console.log("\n", doc.text, "\n");
    console.log("Arguments:", "\n");
    Object.keys(doc.args).map(e => {
        console.log(e, "\t", doc.args[e]);
    });
  }
  else
  {
    console.error(`No Such Document: ${docName}`);
  }
}

export default compose (
  Documentable({
  text: `# readDocs`,
  args: {
    docName: 'Arg 0'
  }
}),
  Commandable((program) => {
  program
    .command('readDocs <docName>' )
    .description('Invoke readDocs')
    .action(readDocs);
}),


)(readDocs);
