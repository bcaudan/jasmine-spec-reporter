var colors = require('colors');

var SpecMetrics = require('./spec-metrics');
var SpecDisplay = require('./spec-display');

var DefaultProcessor = require('./processors/default-processor');
var SpecPrefixesProcessor = require('./processors/spec-prefixes-processor');
var SpecColorsProcessor = require('./processors/spec-colors-processor');
var SpecDurationsProcessor = require('./processors/spec-durations-processor');
var SuiteNumberingProcessor = require('./processors/suite-numbering-processor');

var SpecReporter = function (options) {
  this.started = false;
  this.finished = false;
  this.options = options || {};
  initColors(this.options);

  this.display = new SpecDisplay(this.options, initProcessors(this.options));
  this.metrics = new SpecMetrics();
};

function initColors(options) {
  colors.setTheme({
    success: options.colors && options.colors.success ? options.colors.success : 'green',
    failure: options.colors && options.colors.failure ? options.colors.failure : 'red',
    skipped: options.colors && options.colors.skipped ? options.colors.skipped : 'cyan'
  });
}

function initProcessors(options) {
  var displayProcessors = [
    new DefaultProcessor(),
    new SpecPrefixesProcessor(options.prefixes),
    new SpecColorsProcessor()
  ];

  if (options.displaySpecDuration) {
    displayProcessors.push(new SpecDurationsProcessor());
  }

  if (options.displaySuiteNumber) {
    displayProcessors.push(new SuiteNumberingProcessor());
  }

  if (options.customProcessors) {
    options.customProcessors.forEach(function (Processor) {
      displayProcessors.push(new Processor(options));
    })
  }

  return displayProcessors;
}

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
    this.display.started(spec);
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
