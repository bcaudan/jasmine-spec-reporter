var DisplayProcessor = require('../display-processor');

function SuiteNumberingProcessor() {
  this.suites = {};
  this.computeNumber = function (suite) {
    var count = this.computeSuiteNumber(suite);
    return this.computeParentNumber(suite, count);
  };
  this.computeParentNumber = function (suite, count) {
    var parent = suite.parentSuite;
    while (parent != null) {
      parent = parent.parentSuite;
      count = this.suites[getId(parent)].count + "." + count;
    }
    return count;
  };
  this.computeSuiteNumber = function (suite) {
    var parentId = getId(suite.parentSuite);
    if (!this.suites[parentId]) {
      this.suites[parentId] = {
        count: 0
      }
    }
    return ++this.suites[parentId].count
  };
  function getId(suite) {
    return (suite) ? suite.id : null;
  }
}

SuiteNumberingProcessor.prototype = new DisplayProcessor();

SuiteNumberingProcessor.prototype.displaySuite = function (suite, log) {
  return this.computeNumber(suite) + ' ' + log;
};

module.exports = SuiteNumberingProcessor;
