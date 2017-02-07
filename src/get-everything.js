/* global mkdir */
require('shelljs/global');
const request = require('request-promise');
const co = require('co');
const moment = require('moment');
let lang = 'en-gb';
const config = require('./config');
const allLangs = process.argv.indexOf('all-langs') > -1;
const daily = process.argv.indexOf('daily') > -1;
const timestamp = moment().format('YYYY-MM-DD');
const path = require('path');
let targetDir = path.resolve(__dirname, '../output');

if (daily) {
  targetDir = `daily/${timestamp}`;
  if (!test('-d', targetDir)) {
    mkdir('-p', targetDir);
  }
}

const apiUrl = config.api;
const localeMap = config.locales;
const packageId = config.package;
const resourceNames = (config.resources || '').split(',');
const langs = allLangs ? localeMap : [lang];

if (!packageId) {
  console.error('PACKAGE not set.');
  process.exit(1);
}

if (!resourceNames.length) {
  console.error('RESOURCES not set. Set a comma delimited list of resource ids.');
  process.exit(1);
}

co(function * () {
  for (let m = 0; m < langs.length; m++) {
    const lang = langs[m];
    const resources = resourceNames.reduce((acc, resName) => {
      acc[resName] = `${apiUrl}/Resources/${lang}/${resName}?package=${packageId}`;
      return acc;
    }, {});

    const keys = Object.keys(resources);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      let body = yield request({url: resources[key], rejectUnauthorized: false});
      body = body.replace(/^[^=]*=\s+/, '');
      let formatted;
      try {
        body = JSON.parse(body);
        formatted = JSON.stringify(body, null, '  ');
      } catch (err) {
        console.error(err);
      }
      if (formatted) {
        formatted.to(`${targetDir}/${key}_${lang}.json`);
      }
    }
  }
});
