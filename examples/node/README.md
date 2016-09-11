Use jasmine-spec-reporter with Node
===================================
The `jasmine-spec-reporter` can be used to enhance your [jasmine node](https://github.com/jasmine/jasmine-npm) tests execution report.

## Configuration

Create a `jasmine-runner.js` file with the following content:

```node
var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var noop = function() {};

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});    // remove default reporter logs
jrunner.addReporter(new SpecReporter());            // add jasmine-spec-reporter
jrunner.loadConfigFile();                           // load jasmine.json configuration
jrunner.execute();
```

Then run your tests with:

    node jasmine-runner.js

## Example

You can find an example in this directory:

    npm install
    npm start
