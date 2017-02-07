/* global cat:false */
// uses upload.json
require('shelljs/global');
const request = require('request-promise');
const config = require('./config');
const uri = `${config.api}/labels`;

console.warn('TODO: overwrite does not work, delete first');

let input = cat('upload.json');
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
  request({method: 'POST', uri, body, json: true, rejectUnauthorized: false})
    .then((result) => {
      console.log(`Uploaded: ${i + 1}. (out of ${l}) - Result: ${JSON.stringify(result)}`);
    })
    .catch(err => {
      console.log(`Failed: ${i + 1}. [${id}] - Err: `, err.statusCode, err.statusMessage);
    });
}
