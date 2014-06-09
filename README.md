[![Build Status](https://travis-ci.org/bcaudan/jasmine-spec-reporter.svg?branch=master)](https://travis-ci.org/bcaudan/jasmine-spec-reporter)
jasmine-spec-reporter
=====================

Console spec reporter for jasmine behavior-driven development testing framework.

![](https://raw.github.com/bcaudan/jasmine-spec-reporter/master/screenshot.png)

# Usage

## Default options

    {
      displayStacktrace: false,     // display stacktrace for each failed assertion
      displaySuccessfulSpec: true,  // display each successful spec
      displayFailedSpec: true,      // display each failed spec
      displaySkippedSpec: false,    // display each skipped spec
      displaySpecDuration: false,   // display each spec duration
      colors: {
        success: 'green',
        failure: 'red',
        skipped: 'cyan'
      }
    }

Colors are displayed in the console via [colors](https://github.com/Marak/colors.js), you can see all available colors on the [project page](https://github.com/Marak/colors.js).
You can also disable colors with the option: `colors: false`.

## Protractor
The `jasmine-spec-reporter` can be used to enhance your [Protractor](https://github.com/angular/protractor) tests execution report.

Install `jasmine-spec-reporter` via npm:

    npm install jasmine-spec-reporter --save-dev

Use it in your Protractor configuration file:

    exports.config = {
       // your config here ...

       onPrepare: function() {
          require('jasmine-spec-reporter');
          // add jasmine spec reporter
          jasmine.getEnv().addReporter(new jasmine.SpecReporter({displayStacktrace: true}));
       }
    }

## Hack to remove protractor dot reporter

In order to remove the dot reporter, I proposed this [PR](https://github.com/juliemr/minijasminenode/pull/17).
In the meantime, you can follow these instructions to get rid of it now:

Create a file in your project, for example `spec/util/reporter-hack.js`,  with this code:

    var reporters = jasmine.getEnv().reporter.subReporters_;
    var jasmineSpecReporter, minijasmineReporter;
    for (var i = 0 ; i < reporters.length ; i++) {
      if (reporters[i].callback_ !== undefined) {
        minijasmineReporter = reporters[i];
      }
      if (reporters[i].jasmineCallback !== undefined) {
        jasmineSpecReporter = reporters[i];
      }
    }
    if (jasmineSpecReporter && minijasmineReporter) {
      jasmineSpecReporter.jasmineCallback = minijasmineReporter.callback_;
      reporters.splice(reporters.indexOf(minijasmineReporter), 1);
    } else {
      console.log('Unable to find both reporters');
      console.log('jasmineSpecReporter:\n', jasmineSpecReporter);
      console.log('minijasmineReporter:\n', minijasmineReporter);
    }

In you protractor conf, add this file to your spec files:

    specs: [
        'spec/util/reporter-hack.js',
        ...
    ]

## Developement

* launch all unit tests: `npm test`
* launch an output example: `npm run example`
