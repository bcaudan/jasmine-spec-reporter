Use jasmine-spec-reporter with Node
===================================
The `jasmine-spec-reporter` can be used to enhance your [jasmine node](https://github.com/jasmine/jasmine-npm) tests execution report.

## Configuration

Create a `jasmine-runner.js` file with the following content:

```node
var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});    // jasmine < 2.4.1, remove default reporter logs
jasmine.getEnv().clearReporters();                  // jasmine >= 2.5.2, remove default reporter logs
jrunner.addReporter(new SpecReporter());            // add jasmine-spec-reporter
jrunner.loadConfigFile();                           // load jasmine.json configuration
jrunner.execute();
```

Then run your tests with:

    node jasmine-runner.js
