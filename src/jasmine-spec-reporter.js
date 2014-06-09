var colors = require('colors');

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

var SpecDisplay = function (options) {
  this.indent = '  ';
  this.currentIndent = '';
  this.displayedSuites = [];
  this.lastWasNewLine = false;
  this.displayStacktrace = options.displayStacktrace || false;
  this.displaySuccessfulSpec = options.displaySuccessfulSpec !== false;
  this.displayFailedSpec = options.displayFailedSpec !== false;
  this.displaySkippedSpec = options.displaySkippedSpec || false;
  this.displaySpecDuration = options.displaySpecDuration || false;
  this.displayWithoutColors = options.colors === false;

  colors.setTheme({
    success: options.colors && options.colors.success ? options.colors.success : 'green',
    failure: options.colors && options.colors.failure ? options.colors.failure : 'red',
    skipped: options.colors && options.colors.skipped ? options.colors.skipped : 'cyan'
  });
};

SpecDisplay.prototype = {
  summary: function (metrics) {
    var execution = 'Executed ' + metrics.executedSpecs + ' of ' + metrics.totalSpecs + (metrics.totalSpecs === 1 ? ' spec ' : ' specs ');
    var successful = (metrics.failedSpecs == 0) ? 'SUCCESS ' : '';
    var failed = (metrics.failedSpecs > 0) ? '(' + metrics.failedSpecs + ' FAILED) ' : '';
    var skipped = (metrics.skippedSpecs > 0) ? '(skipped ' + metrics.skippedSpecs + ') ' : '';
    var duration = 'in ' + metrics.duration + '.';

    this.resetIndent();
    this.newLine();
    this.log(execution + successful.success + failed.failure + skipped + duration);
  },

  successful: function (spec) {
    if (this.displaySuccessfulSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var result = '✓ ' + spec.results().description;
      var duration = this.displaySpecDuration ? ' (' + spec.duration + ')' : '';
      this.log(result.success + duration)
    }
  },

  failed: function (spec) {
    if (this.displayFailedSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var result = '✗ ' + spec.results().description;
      var duration = this.displaySpecDuration ? ' (' + spec.duration + ')' : '';
      this.log(result.failure + duration);
      this.displayErrorMessages(spec);
    }
  },

  skipped: function (spec) {
    if (this.displaySkippedSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var result = '- ' + spec.results().description;
      this.log(result.skipped)
    }
  },

  displayErrorMessages: function (spec) {
    this.increaseIndent();
    var assertions = spec.results().items_;
    for (var i = 0; i < assertions.length; i++) {
      if (!assertions[i].passed()) {
        this.log('Message:');
        this.increaseIndent();
        this.log(assertions[i].message.failure);
        this.decreaseIndent();
        this.newLine();
        if (this.displayStacktrace) {
          this.log('Stacktrace:');
          this.increaseIndent();
          this.log(assertions[i].trace.stack);
          this.decreaseIndent();
          this.newLine();
        }
      }
    }
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
    if (this.displayWithoutColors) {
      stuff = stuff.stripColors;
    }
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
  this.specStartTime = null;
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
    this.duration = this.formatDuration((new Date()).getTime() - this.startTime);
    this.totalSpecs = this.failedSpecs + this.successfulSpecs + this.skippedSpecs;
    this.executedSpecs = this.failedSpecs + this.successfulSpecs;
  },

  startSpec: function () {
    this.specStartTime = (new Date()).getTime();
  },

  stopSpec: function (spec) {
    spec.duration = this.formatDuration((new Date()).getTime() - this.specStartTime);
  },

  formatDuration: function (durationInMs) {
    var duration = '', durationInSecs, durationInMins, durationInHrs;
    durationInSecs = durationInMs / 1000;
    if (durationInSecs < 1) {
      return durationInSecs + ' secs';
    }
    durationInSecs = Math.round(durationInSecs);
    if (durationInSecs < 60) {
      return durationInSecs + ' secs';
    }
    durationInMins = Math.floor(durationInSecs / 60);
    durationInSecs = durationInSecs % 60;
    if (durationInSecs) {
      duration = ' ' + durationInSecs + ' secs';
    }
    if (durationInMins < 60) {
      return durationInMins + ' mins' + duration;
    }
    durationInHrs = Math.floor(durationInMins / 60);
    durationInMins = durationInMins % 60;
    if (durationInMins) {
      duration = ' ' + durationInMins + ' mins' + duration;
    }
    return durationInHrs + ' hours' + duration;
  }
};

jasmine.SpecReporter = SpecReporter;
