require('coffee-script/register');
var path = require('path');
var Jasmine = require('jasmine');
var SpecReporter = require('../src/jasmine-spec-reporter.js');
var noop = function () {};

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({onComplete: noop, print: noop});
jasmine.getEnv().addReporter(new SpecReporter({
  displayStacktrace: false,
  displayFailuresSummary: true,
  displaySuccessfulSpec: true,
  displayFailedSpec: true,
  displaySkippedSpec: false,
  displaySpecDuration: false,
  displaySuiteNumber: false,
  colors: {
    success: 'green',
    failure: 'red',
    skipped: 'cyan'
  },
  prefixes: {
    success: '✓ ',
    failure: '✗ ',
    skipped: '- '
  },
  customProcessors: []
}));
jrunner.projectBaseDir = '';
jrunner.specDir = '';
jrunner.addSpecFiles([path.resolve('example/example-spec.coffee')]);
jrunner.execute();
