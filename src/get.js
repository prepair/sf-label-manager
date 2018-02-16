// params: lang group id
require('shelljs/global');
const request = require('request-promise');
const co = require('co');
const config = require('./config');
const fileName = process.argv[5];

if (process.argv.length < 5) {
  console.log('usage: get [LANG] [GROUP] [ID] fileName');
  console.log('example: get Invariant PrepairUserFlowResources calendar-months');
  console.log('warning: all values are case sensitive!');
  process.exit();
}

const lang = process.argv[2]; // en-gb
const group = process.argv[3]; // PrepairUserFlowResources
const id = process.argv[4]; // calendar-months
const url = `${config.api.replace(/,.*/, '')}/labels/?classId=${group}`;

co(function * () {
  let body = yield request({url, rejectUnauthorized: false, timeout: config.timeout});
  let ret = {};
  let formatted = '';
  try {
    body = JSON.parse(body);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  ret.ClassId = group;
  ret.Items = {};
  ret.Items[id] = {
    Description: body.Items[id].Description,
    Value: {}
  };
  ret.Items[id].Value[lang] = body.Items[id].Value[lang];
  formatted = JSON.stringify(ret, null, '  ');
  if (fileName) {
    formatted.to(fileName);
  } else {
    console.log(formatted);
  }
});
