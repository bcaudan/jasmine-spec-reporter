function DisplayProcessor () {}

DisplayProcessor.prototype.displaySuite = function (suite, log) {
  return log;
};

DisplayProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log;
};

DisplayProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log;
};

DisplayProcessor.prototype.displaySkippedSpec = function (spec, log) {
  return log;
};

module.exports = DisplayProcessor;
