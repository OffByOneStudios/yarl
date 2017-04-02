'use babel'
import {compose} from 'redux';

import Documentable from './documentable';
import Context from './context';
import Commandable from './commandable';
import Tagable from './tagable';

let express;
let bodyParser;
let graphqlExpress;
let cors;
if(!YARL_BROWSER) {
  cors = require('cors');
  express = require('express');
  bodyParser = require('body-parser');
  graphqlExpress = require('graphql-server-express').graphqlExpress;
}

function serveForever() {
  const PORT = 3000;

  const app = express();

  app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema: global.Context.GraphQL }));

  console.log("Serving on Port 3000");
  app.listen(PORT);
}


export default compose (
  Documentable({
      text: `
  # serveForever
  Drop the Cli into just serving the graphql endpoint until you quit`,
      args: {}
  }),
  Commandable((program) => {
    program
      .command('serveForever' )
      .description('Start the Graphql endpoint')
      .action(serveForever);
  }),
  Tagable({platform: 'node'})
)(serveForever);
