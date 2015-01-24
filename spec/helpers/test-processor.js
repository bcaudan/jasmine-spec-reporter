var DisplayProcessor = require('../../src/display-processor');

function TestProcessor(options) {
  this.test = options.test;
}

TestProcessor.prototype = new DisplayProcessor();

TestProcessor.prototype.displaySuite = function (suite, log) {
  return log + this.test;
};

TestProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log + this.test;
};

TestProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log + this.test;
};

TestProcessor.prototype.displayPendingSpec = function (spec, log) {
  return log + this.test;
};

module.exports = TestProcessor;
