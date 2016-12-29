Use jasmine-spec-reporter with Node
===================================
The `jasmine-spec-reporter` can be used to enhance your [jasmine node](https://github.com/jasmine/jasmine-npm) tests execution report.

## Configuration

Create a `jasmine-runner.js` file with the following content:

```node
let Jasmine = require('jasmine');
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

let jrunner = new Jasmine();
jrunner.env.clearReporters();           // remove default reporter logs
jrunner.addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true
  }
}));
jrunner.loadConfigFile();               // load jasmine.json configuration
jrunner.execute();
```

Then run your tests with:

    node jasmine-runner.js

## Example

You can find an example in this directory:

    npm install
    npm start
