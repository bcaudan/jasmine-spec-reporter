import {DisplayProcessor} from '../display-processor';

function SpecColorsProcessor() {}

SpecColorsProcessor.prototype = new DisplayProcessor();

SpecColorsProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log.success;
};

SpecColorsProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log.failure;
};

SpecColorsProcessor.prototype.displayPendingSpec = function (spec, log) {
  return log.pending;
};

module.exports = SpecColorsProcessor;
