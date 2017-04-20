'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'
import jsonpath from 'jsonpath';



function setJsonPath(target, propPath, propValue) {
  const head = propPath.split(".");
  const tail = head.pop();


  const q = (head.length) ? `$.${head.join(".")}` : "$";
  const res = jsonpath.query(target, q)[0];

  if(res === undefined) {
    throw `No Such Path ${propPath}`;
  }
  if(res[tail] === undefined) {
    throw `No Such Field: ${tail} On Path ${propPath}`
  }
  res[tail] = propValue;
  return res;
}

export default compose (
  Documentable({
    text: `# setJsonPath`,
    args: {
      target: 'Arg 0',
      propPath: 'Arg 1',
      propValue: 'Arg 2'
    }
  }),



)(setJsonPath);
