
let path = require('path');
let fs = require('fs');
let child_process = require('child_process');
let commander = require('commander');

commander.command('publish')
.description('Safely Publish this nonsense to npm')
.option('-q, -revision', 'Increment the Revision <xx.xx.xx+1')
.option('-w, -minor', 'Increment the Revision <xx.xx+1.xx')
.option('-e, -major', 'Increment the Revision <xx.xx.xx+1')
.action(publish);

function publish(options) {
  console.log("Building");
  options.revision = options.revision || !(options.minor || options.major)
  let p = JSON.parse(fs.readFileSync("package.json").toString());
  let v = p.version.split(".").map(e=>{ return parseInt(e)});
  if(options.revision) {
    v[2] += 1;
  }
  if(options.minor) {
    v[1] += 1;
    v[2] = 0;
  }
  if(options.major) {
    v[0] += 1;
    v[1] = 0;
    v[2] = 0;
  }
  p.version = `${v[0]}.${v[1]}.${v[2]}`;
  fs.writeFileSync("package.json", JSON.stringify(p, undefined, 2))
  delete p.scripts.publish;
  delete p.scripts.prepublishOnly;

  fs.writeFileSync("dist/package.json", JSON.stringify(p, undefined, 2))
}
commander.parse(process.argv);
