/* global cat:false, cp:false, mkdir:false */
// uses upload.json
require('shelljs/global');
const shelljs = require('shelljs');
const request = require('request-promise');
require('colors');
const config = require('./config');
const uris = config.api.split(',').map(s => s + '/labels');

const rename = process.env.OPERATION === 'rename';
const isDeleteKeys = process.env.OPERATION === 'delete';
const backupDir = 'uploaded-jsons';
const fileName =
  process.env.UPLOAD_FILE_NAME ||
  (isDeleteKeys ? 'delete.json' : rename ? 'rename.json' : 'upload.json');
const now = new Date()
  .toISOString()
  .substring(0, 19)
  .replace('T', '_')
  .replace(/:/g, '-');
const method = isDeleteKeys ? 'DELETE' : rename ? 'PUT' : 'POST';

let input = cat(fileName);
const inputSize = input.length;

try {
  input = JSON.parse(input);
} catch (err) {
  console.error(`JSON parse error. Is "${fileName}" a valid json?`, err);
  process.exit(1);
}

if (!input.length) {
  console.error('Payload is not an array?'.red.bold);
  process.exit(1);
}

function upload (uri, count) {
  for (let i = 0, l = input.length; i < l; i++) {
    const body = input[i];
    const id = body.Items ? Object.keys(body.Items)[0] : '?';
    const tfsId = String(body.TaskId || 0).replace(/[^\d]/g, '');
    delete body.TaskId; // not yet implemented in the api
    const environment = uri.split('.')[1];
    console.log(`Uploading to ${environment}.... please wait!`.grey);
    return request({
      method,
      uri,
      body,
      json: true,
      rejectUnauthorized: false,
      timeout: config.timeout
    })
      .then(result => {
        console.log(
          `Uploaded to ${environment}: ${i +
            1}. (out of ${l}) - Result: ${JSON.stringify(result)}`.green.bold
        );
        shelljs.config.silent = true;
        if (isDeleteKeys) return;
        mkdir(backupDir);
        let target = `${backupDir}/${now}_#${tfsId}_${fileName}`;
        if (count === 0) {
          cp(fileName, target);
          console.log(`File backed up to ${target}`);
        }
      })
      .catch(err => {
        console.log(
          `Upload failed to ${environment}: ${i + 1}. [${id}] - Err: ${
            err.response.statusCode
          }`.bold.red
        );
      });
  }
}

const startTime = Date.now();
async function run (uri, count) {
  if (uris.length > 1) {
    console.info(`Uploading to ${uris.length} url(s)`);
  }
  for (let i = 0, l = uris.length; i < l; i++) {
    await upload(uris[i], i);
  }
  const time = (Date.now() - startTime) / 1000;
  console.log(`Uploaded ${inputSize}b in ${time}s`);
}

run();
