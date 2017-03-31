/* global cat:false, cp:false, mkdir:false */
// uses upload.json
require('shelljs/global');
const shelljs = require('shelljs');
const request = require('request-promise');
const config = require('./config');
const uri = `${config.api}/labels`;

console.warn('TODO: overwrite does not work, delete first');

const backupDir = 'uploaded-jsons';
const fileName = 'upload.json';
const now = (new Date()).toISOString().substring(0, 19).replace('T', '_').replace(/:/g, '-');

let input = cat(fileName);
try {
  input = JSON.parse(input);
} catch (err) {
  console.error(err);
  process.exit(1);
}

// co(function * () { --- let's hope sf can handle a bulk burst
for (let i = 0, l = input.length; i < l; i++) {
  const body = input[i];
  const id = Object.keys(body.Items)[0];
  delete body.TaskId; // not yet implemented in the api
  request({method: 'POST', uri, body, json: true, rejectUnauthorized: false})
    .then((result) => {
      console.log(`Uploaded: ${i + 1}. (out of ${l}) - Result: ${JSON.stringify(result)}`);
      shelljs.config.silent = true;
      mkdir(backupDir);
      let target = `${backupDir}/${now}_${fileName}`;
      cp(fileName, target);
      console.log(`File backed up to ${target}`);
    })
    .catch(err => {
      console.log(`Failed: ${i + 1}. [${id}] - Err: `, err.statusCode, err.statusMessage);
    });
}
