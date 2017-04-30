'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import Commandable from '../../../configure/libs/commandable'

import jq from 'jqgram';
let babel;
if(!YARL_BROWSER) {
  babel = require('babel-core');
}
import jsonpath from 'jsonpath';

let bluebird = require("bluebird");
let fs = bluebird.promisifyAll(require('fs'));
let path = require('path');

const contentTypes = [
  "action",
  "component",
  "lib",
];

const babelOps = {
  code: false,
  "presets": [
    "react",
  ],
  "plugins": [
     "syntax-decorators",
     "syntax-class-properties",
  ]
}

function walk(n) {
  switch (n.type) {
    case "FunctionDeclaration":
      console.log("FunctionDeclaration");
      return [...n.params, ...n.body.body];
    case "Identifier":
      console.log("Identifier");
      return undefined;
    case "BlockStatement":
      console.log("BlockStatement");
      return n.body;
    case "VariableDeclaration":
      return n.declarations;
    case "TryStatement":
      console.log("TryStatement");
      return [...n.block.body, ...n.handler.body];
    case "CallExpression":
      console.log("CallExpression");
      return n.arguments;

    // case "ReturnStatement":
    // case "AwaitExpression":
    //   return [n.argument];
    // case "VariableDeclarator":
    //   return [n.init];
    default:
      return n.body;
  }
}

function score(astNode) {
  switch (astNode.type) {
    case "VariableDeclarator":
    case "FunctionDeclaration":
      return astNode.id.name;

    case "UnaryStatement":
    case "BinaryStatement":
      return astNode.operator;
    case "Identifier":
      return astNode.name;
    case "BlockStatement":
    case "VariableDeclaration":
    case "TryStatement":
    default:
      return astNode.type;
  }
}

async function functionDistance(moduleOne,functionOne,moduleTwo,functionTwo) {
  const modulePath = path.join(process.cwd(), `src/modules`);
  try
  {
    const m1 = await fs.statAsync(`${modulePath}/${moduleOne}`);
    const m2 = await fs.statAsync(`${modulePath}/${moduleTwo}`);
    const d1 = (await fs.readFileAsync(`${modulePath}/${moduleOne}/libs/${functionOne}.js`)).toString();
    const d2 = (await fs.readFileAsync(`${modulePath}/${moduleTwo}/libs/${functionTwo}.js`)).toString();


    const q = "$.ast.program"//.body[?(@.type === 'FunctionDeclaration')]";
    const b1 = jsonpath.query(babel.transform(d1, babelOps), q)[0]
      //.filter(e => {return  e.id.name === functionOne})[0];

    const b2 = jsonpath.query(babel.transform(d2, babelOps), q)[0]
      //.filter(e => {return  e.id.name === functionTwo})[0];




    const res = await new Promise((resolve, reject) => {
      jq.jqgram.distance({
        root : b1,
        lfn: score,
        cfn: walk,
      }, {
        root : b2,
        lfn: score,
        cfn: walk,
      }, {
        p:2,
        q:3,
        depth:20
      },(result)=> {
        resolve(result)
      });
    });
    console.log(res);
  }
  catch(e)
  {
    console.error(e);
    return;
  }

}

export default compose (
  Documentable({
    text: `# functionDistance`,
    args: {
      moduleOne: 'Arg 0',
    functionOne: 'Arg 1',
    moduleTwo: 'Arg 2',
    functionTwo: 'Arg 3'
    }
  }),
  Commandable((program) => {
  program
    .command('functionDistance <moduleOne> <functionOne> <moduleTwo> <functionTwo>' )
    .description('Invoke functionDistance')
    .action(functionDistance);
}),


)(functionDistance);
