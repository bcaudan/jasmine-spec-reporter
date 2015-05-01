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
    pending: options.colors && options.colors.pending ? options.colors.pending : 'cyan'
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
  jasmineStarted: function (info) {
    this.started = true;
    this.display.log('Spec started');
    this.metrics.start(info);
  },

  jasmineDone: function () {
    this.metrics.stop();
    this.display.summary(this.metrics);
    this.finished = true;
  },

  suiteStarted: function (suite) {
    this.display.suite(suite);
  },

  suiteDone: function (suite) {
    this.display.suiteResults(suite);
  },

  specStarted: function (spec) {
    this.metrics.startSpec();
  },

  specDone: function (spec) {
    this.metrics.stopSpec(spec);
    if (spec.status == 'pending' || spec.status == 'disabled') {
      this.metrics.pendingSpecs++;
      this.display.pending(spec);
    } else if (spec.status == 'passed') {
      this.metrics.successfulSpecs++;
      this.display.successful(spec);
    } else {
      this.metrics.failedSpecs++;
      this.display.failed(spec);
    }
  },

  reportRunnerStarting: function () {
      this.display.newLine();
      this.display.log('*******************************************************************');
      this.display.log('* Oops!                                                           *');
      this.display.log('* jasmine-spec-reporter 2.x is not compatible with jasmine < 2.x. *');
      this.display.log('*                                                                 *');
      this.display.log('* Please consider using jasmine-spec-reporter < 2.0.0.            *');
      this.display.log('*                                                                 *');
      this.display.log('*      npm install jasmine-spec-reporter@"<2.0.0" --save-dev      *');
      this.display.log('*******************************************************************');
      this.display.newLine();
  }
};

module.exports = SpecReporter;
