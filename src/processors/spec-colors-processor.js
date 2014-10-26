var DisplayProcessor = require('../display-processor');

function SpecColorsProcessor() {}

SpecColorsProcessor.prototype = new DisplayProcessor();

SpecColorsProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log.success;
};

SpecColorsProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log.failure;
};

SpecColorsProcessor.prototype.displaySkippedSpec = function (spec, log) {
  return log.skipped;
};

module.exports = SpecColorsProcessor;
