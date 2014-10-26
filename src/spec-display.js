var SpecDisplay = function (options, displayProcessors) {
  this.indent = '  ';
  this.currentIndent = '';
  this.displayedSuites = [];
  this.failedSpecs = [];
  this.lastWasNewLine = false;
  this.displayStacktrace = options.displayStacktrace || false;
  this.displayFailuresSummary = options.displayFailuresSummary !== false;
  this.displaySuccessfulSpec = options.displaySuccessfulSpec !== false;
  this.displayFailedSpec = options.displayFailedSpec !== false;
  this.displaySkippedSpec = options.displaySkippedSpec || false;
  this.displayWithoutColors = options.colors === false;
  this.displayProcessors = displayProcessors;
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
    if (this.displayFailuresSummary && metrics.failedSpecs > 0) {
      this.failuresSummary();
    }
    this.log(execution + successful.success + failed.failure + skipped + duration);
  },

  failuresSummary: function () {
    this.log("**************************************************");
    this.log("*                    Failures                    *");
    this.log("**************************************************");
    this.newLine();
    for (var i = 0 ; i < this.failedSpecs.length ; i++) {
      this.failedSummary(this.failedSpecs[i], i + 1);
      this.newLine();
    }
    this.newLine();
    this.resetIndent();
  },

  failedSummary: function (spec, index) {
    this.log(index + ') ' + this.getFullDescription(spec));
    this.displayErrorMessages(spec);
  },

  getFullDescription: function (spec) {
    var description = spec.results().description;
    var suite = spec.suite;
    while (suite !== null) {
      description = suite.description + ' ' + description;
      suite = suite.parentSuite;
    }
    return description;
  },

  successful: function (spec) {
    if (this.displaySuccessfulSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var log = null;
      this.displayProcessors.forEach(function (displayProcessor) {
        log = displayProcessor.displaySuccessfulSpec(spec, log);
      });
      this.log(log);
    }
  },

  failed: function (spec) {
    this.failedSpecs.push(spec);
    if (this.displayFailedSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var log = null;
      this.displayProcessors.forEach(function (displayProcessor) {
        log = displayProcessor.displayFailedSpec(spec, log);
      });
      this.log(log);
      this.displayErrorMessages(spec);
    }
  },

  skipped: function (spec) {
    if (this.displaySkippedSpec) {
      this.ensureSuiteDisplayed(spec.suite);
      var log = null;
      this.displayProcessors.forEach(function (displayProcessor) {
        log = displayProcessor.displaySkippedSpec(spec, log);
      });
      this.log(log);
    }
  },

  displayErrorMessages: function (spec) {
    this.increaseIndent();
    var assertions = spec.results().items_;
    for (var i = 0; i < assertions.length; i++) {
      if (!assertions[i].passed()) {
        this.log('- '.failure + assertions[i].message.failure);
        if (this.displayStacktrace) {
          this.log(this.filterStackTraces(assertions[i].trace.stack));
        }
      }
    }
    this.decreaseIndent();
  },

  filterStackTraces: function (traces) {
    var lines = traces.split('\n');
    var filtered = [];
    for (var i = 1 ; i < lines.length ; i++) {
      if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
        filtered.push(lines[i]);
      }
    }
    return filtered.join('\n');
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
    var log = null;
    this.displayProcessors.forEach(function (displayProcessor) {
      log = displayProcessor.displaySuite(suite, log);
    });
    this.log(log);
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

module.exports = SpecDisplay;
