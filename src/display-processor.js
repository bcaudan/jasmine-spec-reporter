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

DisplayProcessor.prototype.displayStartedSpec = function (spec, log) {
  return spec.description;
};

module.exports = DisplayProcessor;
