var SpecMetrics = require('./spec-metrics');
var SpecDisplay = require('./spec-display');

var SpecReporter = function (options) {
  this.started = false;
  this.finished = false;
  this.options = options || {};
  this.metrics = new SpecMetrics();
  this.display = new SpecDisplay(this.options);
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

module.exports = SpecReporter;
