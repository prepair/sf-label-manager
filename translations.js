const fs = require('fs');

if (process.argv.length !== 3) {
  console.log('Usage: node translations.js <json-file>');
  process.exit(1);
}

const jsonFile = process.argv[2];

fs.readFile(jsonFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  const jsonData = JSON.parse(data)[0];

  if (!jsonData.Items) {
    console.error('No "Items" key found in the JSON file');
    process.exit(1);
  }

  let counter = 1;

  for (const [key, item] of Object.entries(jsonData.Items)) {
    // Searching for en-gb keys
    if (item.Value && item.Value['en-gb']) {
      const value = item.Value['en-gb'];

      console.log(`${counter},`);
      console.log(`key: ${key}`);
      console.log(`value: ${value}`);
      console.log('');

      counter++;
    }
  }
});
