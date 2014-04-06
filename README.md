jasmine-spec-reporter
=====================

Console spec reporter for jasmine behavior-driven development testing framework.

![](https://raw.github.com/bcaudan/jasmine-spec-reporter/master/screenshot.png)

# Usage

## Protractor
The `jasmine-spec-reporter` can be used to enhance your [Protractor](https://github.com/angular/protractor) tests execution report.

Install `jasmine-spec-reporter` via npm:

    npm install jasmine-spec-reporter --save-dev

Use it in your Protractor configuration file:

    require('jasmine-spec-reporter');

    exports.config = {
       // your config here ...

       onPrepare: function() {
          // add jasmine spec reporter
          jasmine.getEnv().addReporter(new jasmine.SpecReporter());
       }
    }

