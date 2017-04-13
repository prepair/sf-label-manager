/* global cat:false, cp:false, mkdir:false */
// uses upload.json
require('shelljs/global');
const shelljs = require('shelljs');
const request = require('request-promise');
const config = require('./config');
const uri = `${config.api}/labels`;

console.warn('TODO: overwrite does not work, delete first');

const rename = process.env.OPERATION === 'rename';
const backupDir = 'uploaded-jsons';
const fileName = process.env.UPLOAD_FILE_NAME || (rename ? 'rename.json' : 'upload.json');
const now = (new Date()).toISOString().substring(0, 19).replace('T', '_').replace(/:/g, '-');
const method = rename ? 'PUT' : 'POST';

let input = cat(fileName);
try {
  input = JSON.parse(input);
} catch (err) {
  process.exit(1);
}

if (!input.length) {
  console.error('Payload is not an array?');
  process.exit(1);
}

// co(function * () { --- let's hope sf can handle a bulk burst
for (let i = 0, l = input.length; i < l; i++) {
  const body = input[i];
  const id = body.Items ? Object.keys(body.Items)[0] : '?';
  const tfsId = String(body.TaskId || 0).replace(/[^\d]/g, '');
  delete body.TaskId; // not yet implemented in the api
  console.log('Uploading.... please wait!');
  request({method, uri, body, json: true, rejectUnauthorized: false})
    .then((result) => {
      console.log(`Uploaded: ${i + 1}. (out of ${l}) - Result: ${JSON.stringify(result)}`);
      shelljs.config.silent = true;
      mkdir(backupDir);
      let target = `${backupDir}/${now}_#${tfsId}_${fileName}`;
      cp(fileName, target);
      console.log(`File backed up to ${target}`);
    })
    .catch(err => {
      console.log(`Failed: ${i + 1}. [${id}] - Err: `, err);
    });
}
