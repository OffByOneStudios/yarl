'use babel'

var NodeGit;
if(!YARL_BROWSER) {
    NodeGit = require('nodegit');
}


import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable';

import Resolvable from '../../../configure/libs//resolvable';


async function showLog(_, {page, limit}) {

  const repository = await NodeGit.Repository.open(process.cwd());
  const head = await repository.getBranchCommit("master");

  return await new Promise(function(resolve, reject) {
    const history = head.history(NodeGit.Revwalk.SORT.Time);
    let res = [];
    history.on('commit', (commit) => {
      res.push({
        author: `${commit.author().name()} < ${commit.author().email()}>`,
        commit: commit.sha(),
        date: commit.date().toString(),
        message: commit.message(),
        body: commit.body()
      });
    });
    history.on('end', (commits) => {
      const p = (page) ? page : 0;
      const l = (limit) ? limit: res.length;
      // TODO Implemement Pagination
      resolve(res);
    });
    history.start();
  });
}

export default compose (
  Documentable({
  text: `# showLog
GraphQL query which returns objects similar to invoking:
\`\`\`sh
git log
\`\`\`\
`,
  args: {
    page: 'Paginate by Limit size',
    limit: 'Limit Number of Arguments'
  }
}),

  Resolvable('Query.showLog')

)(showLog);
