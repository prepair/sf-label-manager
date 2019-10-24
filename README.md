SF label manager
================

SF locale tools. Authentication not required.

## setup

Env vars (dotenv file supported):

* `TIMEOUT`: timeout for request, in millisec, default is 300000 (5 minutes!)
* `API`: sf cms dev url (or urls, separated with comma) with api part (something like https://cms.env.webdev.local/api)
* `PACKAGE`: for the get everything and daily backup scripts: cms package (Prepair, Foobar, Bazqux etc.)
* `RESOURCES`: for the get everything and daily backup scripts: comma separated list of lang resources

Example:

```shell
TIMEOUT=10000
API=https://cms.uat.webdev.local/api,https://cms.dev-actual.webdev.local/api,https://cms.dev-next.webdev.local/api,https://cms.dev-prod.webdev.local/api,https://cms.test.webdev.local/api
PACKAGE=Prepair
RESOURCES=PrepairUserFinderResources,PrepairUserStatusResources,PrepairErrorCodeResources,DoNotTranslateResources
```

If you are using multiple api urls (like in the example) then the get operations (get, get-all) will use the first url from the list.

## npm scripts

### get

`npm run get` - download one specific label for a given language.

* see output for command line options
* use "--" with npm (https://docs.npmjs.com/cli/run-script)
* saves the result to _output.json_
* example: `npm run get -- Invariant FooBarResources qux-title`

Output example:

```json
{
  "ClassId": "FooBarResources",
  "Items": {
    "qux-title": {
      "Description": "Description for the FooBarResources resources class",
      "Value": {
        "Invariant": "The Qux is 42"
      }
    }
  }
}
```

### post

`npm run post` - uploads the _./upload.json_ file.

* try to combine the labels into one big item (_./examples/upload-bfc-season-combined_)
* if you want to upload into different groups then the uploader will
  do it in parallel requests. __This MAY KILL the cms api__.

### delete

`npm run delete` - use the _./delete.json_ file.

* read label keys from delete.json and try to delete all labels

### get-everything

`npm run get-everything` - download all defined groups.

* get all "en-gb" groups
* json files are saved in the _output_ folder

### daily-backup

`npm run daily-backup` - download all the groups and all the languages

* by default saves all languages AND all groups in the _daily_ folder
* use cron or run it manually
