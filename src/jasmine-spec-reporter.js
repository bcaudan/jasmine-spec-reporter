var colors = require('colors');

colors.setTheme({
  success: 'green',
  failure: 'red'
});

if (!jasmine) {
  throw new Exception('jasmine library does not exist in global namespace!');
}

var SpecReporter = function () {
  this.started = false;
  this.finished = false;
  this.metrics = new SpecMetrics();
  this.display = new SpecDisplay();
};

SpecReporter.prototype = {
  reportRunnerStarting: function () {
    this.started = true;
    this.display.log('Spec started');
    this.metrics.start();
  },

  reportRunnerResults: function () {
    this.metrics.stop();
    this.display.summary(this.metrics);
    this.finished = true;
  },

  reportSuiteResults: function (suite) {
    this.display.suiteResults(suite);
  },

  reportSpecStarting: function (spec) {
    this.display.ensureSuiteDisplayed(spec.suite);
  },

  reportSpecResults: function (spec) {
    if (spec.results().skipped) {
      this.metrics.skippedSpecs++;
    } else if (spec.results().passed()) {
      this.metrics.successfulSpecs++;
      this.display.successful(spec);
    } else {
      this.metrics.failedSpecs++;
      this.display.failed(spec);
    }
  }
};

var SpecDisplay = function () {
  this.indent = '  ';
  this.currentIndent = '';
  this.displayedSuites = [];
  this.lastWasNewLine = false;
};

SpecDisplay.prototype = {
  summary: function (metrics) {
    var execution = 'Executed ' + metrics.executedSpecs + ' of ' + metrics.totalSpecs + (metrics.totalSpecs === 1 ? ' spec ' : ' specs ');
    var successful = (metrics.failedSpecs == 0) ? 'SUCCESS ' : '';
    var failed = (metrics.failedSpecs > 0) ? '(' + metrics.failedSpecs + ' FAILED) ' : '';
    var skipped = (metrics.skippedSpecs > 0) ? '(skipped ' + metrics.skippedSpecs + ') ' : '';
    var duration = 'in ' + (metrics.duration / 1000) + ' secs.';

    this.resetIndent();
    this.newLine();
    this.log(execution + successful.success + failed.failure + skipped + duration);
  },

  successful: function (spec) {
    var result = '✓ ' + spec.results().description;
    this.log(result.success)
  },

  failed: function (spec) {
    var result = '✗ ' + spec.results().description;
    this.log(result.failure);
    this.displayErrorMessages(spec);
  },

  displayErrorMessages: function (spec) {
    this.increaseIndent();
    this.log('Message:');
    this.increaseIndent();
    var assertions = spec.results().items_;
    for (var i = 0; i < assertions.length; i++) {
      if (!assertions[i].passed()) {
        this.log(assertions[i].message.failure);
      }
    }
    this.newLine();
    this.decreaseIndent();
    this.decreaseIndent();
  },

  ensureSuiteDisplayed: function (suite) {
    if (!this.hasBeenDisplayed(suite)) {
      this.ensureSuiteDisplayed(suite.parentSuite);
      this.displaySuite(suite);
      this.increaseIndent();
    }
  },

  hasBeenDisplayed: function (suite) {
    return suite == null || this.displayedSuites.indexOf(suite.id) != -1;
  },

  displaySuite: function (suite) {
    this.newLine();
    this.computeSuiteIndent(suite);
    this.log(suite.description);
    this.displayedSuites.push(suite.id);
  },

  suiteResults: function (suite) {
    this.newLine();
    this.decreaseIndent();
  },

  log: function (stuff) {
    console.log(this.currentIndent + stuff);
    this.lastWasNewLine = false;
  },

  newLine: function () {
    if (!this.lastWasNewLine) {
      console.log('');
      this.lastWasNewLine = true;
    }
  },

  computeSuiteIndent: function (suite) {
    this.resetIndent();
    var currentSuite = suite;
    while (currentSuite !== null) {
      this.increaseIndent();
      currentSuite = currentSuite.parentSuite;
    }
  },

  resetIndent: function () {
    this.currentIndent = '';
  },

  increaseIndent: function () {
    this.currentIndent += this.indent;
  },

  decreaseIndent: function () {
    this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
  }
};

var SpecMetrics = function () {
  this.startTime = null;
  this.duration = null;
  this.successfulSpecs = 0;
  this.failedSpecs = 0;
  this.skippedSpecs = 0;
  this.executedSpecs = 0;
  this.totalSpecs = 0;
};

SpecMetrics.prototype = {
  start: function () {
    this.startTime = (new Date()).getTime();
  },

  stop: function () {
    this.duration = (new Date()).getTime() - this.startTime;
    this.totalSpecs = this.failedSpecs + this.successfulSpecs + this.skippedSpecs;
    this.executedSpecs = this.failedSpecs + this.successfulSpecs;
  }
};

jasmine.SpecReporter = SpecReporter;
