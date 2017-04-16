'use babel'
import {compose} from 'redux';

let jp;
if(!YARL_BROWSER) {
  jp = require('jsonpath');
}


import Documentable from '../../../configure/libs/documentable'

import Resolvable from '../../../configure/libs/resolvable'


function proxyRequest(_, {endpoint, method, headers, params, path}) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
      method,
      headers,
      params
    }).then((response) => {
      return response.json()
    }).then((json) => {
      const q = path || "$";
      resolve(jp.query(json, q));
    }).catch((ex) => {reject(ex)})
  });
}

export default compose (
  Documentable({
  text: `# proxyRequest`,
  args: {
    endpoint: 'URL',
    method: 'GET/POST/PUT/DELETE',
    headers: 'JSON HEADERS',
    params: 'Query Params/Body',
    path: 'JSON Path filter'
  }
}),

  Resolvable('Query.proxyRequest')

)(proxyRequest);
