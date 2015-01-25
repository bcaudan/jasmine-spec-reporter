var SpecDisplay = function (options, displayProcessors) {
  this.indent = '  ';
  this.currentIndent = '';
  this.suiteHierarchy = [];
  this.failedSpecs = [];
  this.lastWasNewLine = false;
  this.displayStacktrace = options.displayStacktrace || false;
  this.displayFailuresSummary = options.displayFailuresSummary !== false;
  this.displaySuccessfulSpec = options.displaySuccessfulSpec !== false;
  this.displayFailedSpec = options.displayFailedSpec !== false;
  this.displayPendingSpec = options.displayPendingSpec || false;
  this.displayWithoutColors = options.colors === false;
  this.displayProcessors = displayProcessors;
};

SpecDisplay.prototype = {
  summary: function (metrics) {
    var execution = 'Executed ' + metrics.executedSpecs + ' of ' + metrics.totalSpecsDefined + (metrics.totalSpecsDefined === 1 ? ' spec ' : ' specs ');
    var successful = (metrics.failedSpecs == 0) ? 'SUCCESS ' : '';
    var failed = (metrics.failedSpecs > 0) ? '(' + metrics.failedSpecs + ' FAILED) ' : '';
    var pending = (metrics.pendingSpecs > 0) ? '(' + metrics.pendingSpecs + ' PENDING) ' : '';
    var skipped = (metrics.skippedSpecs > 0) ? '(' + metrics.skippedSpecs + ' SKIPPED) ' : '';
    var duration = 'in ' + metrics.duration + '.';

    this.resetIndent();
    this.newLine();
    if (this.displayFailuresSummary && metrics.failedSpecs > 0) {
      this.failuresSummary();
    }
    this.log(execution + successful.success + failed.failure + pending.pending + skipped + duration);
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
    this.log(index + ') ' + spec.fullName);
    this.displayErrorMessages(spec);
  },

  successful: function (spec) {
    if (this.displaySuccessfulSpec) {
      this.ensureSuiteDisplayed(spec);
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
      this.ensureSuiteDisplayed(spec);
      var log = null;
      this.displayProcessors.forEach(function (displayProcessor) {
        log = displayProcessor.displayFailedSpec(spec, log);
      });
      this.log(log);
      this.displayErrorMessages(spec);
    }
  },

  pending: function (spec) {
    if (this.displayPendingSpec) {
      this.ensureSuiteDisplayed(spec);
      var log = null;
      this.displayProcessors.forEach(function (displayProcessor) {
        log = displayProcessor.displayPendingSpec(spec, log);
      });
      this.log(log);
    }
  },

  displayErrorMessages: function (spec) {
    this.increaseIndent();
    for (var i = 0; i < spec.failedExpectations.length; i++) {
      if (!spec.failedExpectations[i].passed) {
        this.log('- '.failure + spec.failedExpectations[i].message.failure);
        if (this.displayStacktrace && spec.failedExpectations[i].stack) {
          this.log(this.filterStackTraces(spec.failedExpectations[i].stack));
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
    return filtered.join('\n' + this.currentIndent);
  },

  ensureSuiteDisplayed: function (spec) {
    if (this.suiteHierarchy.length == 0) {
      var suiteName = this.getParentName(spec).trim();
      this.suite({id: 'single suite', fullName: suiteName, description: suiteName});
    }
  },

  suite: function (suite) {
    this.newLine();
    this.computeSuiteHierarchy(suite);
    this.computeSuiteIndent();
    var log = null;
    this.displayProcessors.forEach(function (displayProcessor) {
      log = displayProcessor.displaySuite(suite, log);
    });
    this.log(log);
    this.increaseIndent();
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

  computeSuiteHierarchy: function (suite) {
    var parentName = this.getParentName(suite);
    for (var i = 0 ; i < this.suiteHierarchy.length ; i++) {
      if (this.suiteHierarchy[i] == parentName) {
        this.suiteHierarchy.splice(i + 1, this.suiteHierarchy.length - i - 1);
        break;
      }
    }
    if (i == this.suiteHierarchy.length) {
      this.suiteHierarchy.push(parentName);
    }
  },

  computeSuiteIndent: function () {
    this.resetIndent();
    for (var i = 0 ; i < this.suiteHierarchy.length ; i++) {
      this.increaseIndent();
    }
  },

  getParentName: function (element) {
    return element.fullName.replace(element.description, '');
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
