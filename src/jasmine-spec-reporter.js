var colors = require('colors');

colors.setTheme({
  success: 'green',
  failure: 'red'
});

if (!jasmine) {
  throw new Exception("jasmine library does not exist in global namespace!");
}

var SpecReporter = function () {
  this.started = false;
  this.finished = false;
  this.metrics = new SpecMetrics();
};

SpecReporter.prototype = {
  reportRunnerStarting: function () {
    this.started = true;
    this.currentSuiteId = -1;
    this.metrics.start();
    this.indent = "";
  },

  reportRunnerResults: function () {
    this.metrics.stop();
    var spec_str = "Executed " + this.metrics.executedSpecs + " of " + this.metrics.totalSpecs + (this.metrics.totalSpecs === 1 ? " spec " : " specs ");
    var fail_str = "";
    var succ_str = "";
    if (this.metrics.failedSpecs > 0) {
      fail_str += "(" + this.metrics.failedSpecs + " FAILED) ";
    } else {
      succ_str += "SUCCESS ";
    }
    var skip_str = "";
    if (this.metrics.skippedSpecs > 0) {
      skip_str += "(skipped " + this.metrics.skippedSpecs + ") ";
    }

    this.resetIndent();
    this.newLine();
    this.log(spec_str + succ_str.success + fail_str.failure + skip_str + "in " + (this.metrics.duration / 1000) + " secs.");
    this.finished = true;
  },

  reportSuiteResults: function () {
  },

  reportSpecStarting: function (spec) {
    var suite = spec.suite;
    if (suite.id !== this.currentSuiteId) {
      this.displaySuite(spec.suite);
      this.increaseIndent();
      this.currentSuiteId = spec.suite.id;
    }
  },

  displaySuite: function (suite) {
    this.ensureParentSuiteDisplayed(suite.parentSuite);
    this.newLine();
    this.computeIndent(suite);
    this.log(suite.description);
  },

  ensureParentSuiteDisplayed: function (parentSuite) {
    if (parentSuite !== null && parentSuite.id !== this.currentSuiteId) {
      this.displaySuite(parentSuite);
    }
  },

  reportSpecResults: function (spec) {
    if (spec.results().skipped) {
      this.metrics.skippedSpecs++;
    } else if (spec.results().passed()) {
      this.metrics.successfulSpecs++;
      this.log("✓ ".success + spec.results().description.success);
    } else {
      this.metrics.failedSpecs++;
      this.log("✗ ".failure + spec.results().description.failure);
      var items = spec.results().items_;
      this.increaseIndent();
      this.log("Message:");
      this.increaseIndent();
      for (var i = 0; i < items.length; i++) {
        if (!items[i].passed()) {
          this.log(items[i].message.failure);
        }
      }
      this.newLine();
      this.decreaseIndent();
      this.decreaseIndent();
    }
  },

  log: function (stuff) {
    console.log(this.indent + stuff);
  },

  newLine: function () {
    this.log("");
  },

  computeIndent: function (suite) {
    this.resetIndent();
    var currentSuite = suite;
    while (currentSuite !== null) {
      this.indent += "  ";
      currentSuite = currentSuite.parentSuite;
    }
  },

  resetIndent: function () {
    this.indent = "";
  },

  increaseIndent: function () {
    this.indent += "  ";
  },

  decreaseIndent: function () {
    this.indent = this.indent.substr(0, this.indent.length - 2);
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
