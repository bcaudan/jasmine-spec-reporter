[![Build Status](https://travis-ci.org/bcaudan/jasmine-spec-reporter.svg?branch=master)](https://travis-ci.org/bcaudan/jasmine-spec-reporter)
jasmine-spec-reporter
=====================

Real time console spec reporter for jasmine behavior-driven development testing framework.

![](https://raw.github.com/bcaudan/jasmine-spec-reporter/master/screenshot.png)

# Usage
## Protractor
The `jasmine-spec-reporter` can be used to enhance your [Protractor](https://github.com/angular/protractor) tests execution report.

Install `jasmine-spec-reporter` via npm:

    npm install jasmine-spec-reporter --save-dev

Use it in your Protractor configuration file:

    exports.config = {
       // your config here ...

       onPrepare: function() {
          var SpecReporter = require('jasmine-spec-reporter');
          // add jasmine spec reporter
          jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));
       }
    }

## Remove protractor dot reporter
In your protractor configuration file, add the print function in the jasmineNodeOpts section:

    jasmineNodeOpts: {
       ...
       print: function() {}
    }

## Custom output
You can customize the output of the reporter yourself: [see how](https://github.com/bcaudan/jasmine-spec-reporter/blob/master/customize-output.md).

# Default options

    {
      displayStacktrace: false,     // display stacktrace for each failed assertion
      displayFailuresSummary: true, // display summary of all failures after execution
      displaySuccessfulSpec: true,  // display each successful spec
      displayFailedSpec: true,      // display each failed spec
      displayPendingSpec: false,    // display each pending spec
      displaySpecDuration: false,   // display each spec duration
      displaySuiteNumber: false,    // display each suite number (hierarchical)
      colors: {
        success: 'green',
        failure: 'red',
        pending: 'cyan'
      },
      prefixes: {
        success: '✓ ',
        failure: '✗ ',
        pending: '- '
      },
      customProcessors: []
    }

Colors are displayed in the console via [colors](https://github.com/Marak/colors.js), you can see all available colors on the [project page](https://github.com/Marak/colors.js).
You can also disable colors with the option: `colors: false`.

# Compatibility with Jasmine 1.x

To use Jasmine spec reporter with Jasmine 1.x, please see [jasmine1 branch](https://github.com/bcaudan/jasmine-spec-reporter/tree/jasmine1).

# Developement

* install dependencies: `npm install`
* launch all unit tests: `npm test`
* launch an output example: `npm run example`
