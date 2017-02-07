require('dotenv').config();

['API'].forEach(name => {
  if (!process.env[name]) {
    console.error(`"${name}" env var not set!`);
    process.exit(1);
  }
});

module.exports = {
  api: process.env.API,
  package: process.env.package,
  resources: process.env.resources,
  locales: [
    'hu-HU',
    'bg-BG',
    'cs-CZ',
    'bs-Latn-BA',
    'de-DE',
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
    'ka-GE'
  ]
};
