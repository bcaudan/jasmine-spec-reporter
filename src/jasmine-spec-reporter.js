var SpecMetrics = require('./spec-metrics');
var SpecDisplay = require('./spec-display');

if (!jasmine) {
  throw new Exception('jasmine library does not exist in global namespace!');
}

var SpecReporter = function (options) {
  this.started = false;
  this.finished = false;
  this.options = options || {};
  this.metrics = new SpecMetrics();
  this.display = new SpecDisplay(this.options);
  this.jasmineCallback = null;
};

SpecReporter.prototype = {
  reportRunnerStarting: function () {
    this.started = true;
    this.display.log('Spec started');
    this.metrics.start();
  },

  reportRunnerResults: function (runner) {
    this.metrics.stop();
    this.display.summary(this.metrics);
    this.finished = true;
    if(this.jasmineCallback) { this.jasmineCallback(runner); }
  },

  reportSuiteResults: function (suite) {
    this.display.suiteResults(suite);
  },

  reportSpecStarting: function (spec) {
    this.metrics.startSpec();
  },

  reportSpecResults: function (spec) {
    this.metrics.stopSpec(spec);
    if (spec.results().skipped) {
      this.metrics.skippedSpecs++;
      this.display.skipped(spec);
    } else if (spec.results().passed()) {
      this.metrics.successfulSpecs++;
      this.display.successful(spec);
    } else {
      this.metrics.failedSpecs++;
      this.display.failed(spec);
    }
  }
};

jasmine.SpecReporter = SpecReporter;
