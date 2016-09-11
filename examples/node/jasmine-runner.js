var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var noop = function () {};

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});
jrunner.addReporter(new SpecReporter({
  displayStacktrace: 'none',
  displayFailuresSummary: true,
  displayPendingSummary: true,
  displaySuccessesSummary: false,
  displaySuccessfulSpec: true,
  displayFailedSpec: true,
  displayPendingSpec: true,
  displaySpecDuration: false,
  displaySuiteNumber: false,
  colors: {
    success: 'green',
    failure: 'red',
    pending: 'yellow'
  },
  prefixes: {
    success: '✓ ',
    failure: '✗ ',
    pending: '* '
  },
  customProcessors: []
}));
jrunner.loadConfigFile();
jrunner.execute();
