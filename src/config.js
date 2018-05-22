require('dotenv').config();

['API'].forEach(name => {
  if (!process.env[name]) {
    console.error(`"${name}" env var not set!`);
    process.exit(1);
  }
});

module.exports = {
  timeout: parseInt(process.env.timeout, 10) || 1000 * 60 * 35, // 35min, not kidding
  api: process.env.API,
  package: process.env.PACKAGE,
  resources: process.env.RESOURCES,
  locales: [
    'hu-HU',
    'bg-BG',
    'cs-CZ',
    'bs-Latn-BA',
    'de-DE',
    'en',
    'en-GB',
    'es-ES',
    'fr-FR',
    'he-IL',
    'it-IT',
    'lv-LV',
    'mk-MK',
    'lt-LT',
    'nl-NL',
    'nb-NO',
    'pl-PL',
    'pt-PT',
    'ro-RO',
    'ru-RU',
    'sk-SK',
    'sv-SE',
    'sr-Cyrl-CS',
    'uk-UA',
    'ka-GE',
    'el-GR',
    'sq-AL'
  ]
};
