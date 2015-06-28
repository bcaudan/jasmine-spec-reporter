var DisplayProcessor = require('../display-processor');

function SpecPrefixesProcessor(prefixes) {
  this.prefixes = {
    success: prefixes && prefixes.success !== undefined ? prefixes.success : '✓ ',
    failure: prefixes && prefixes.failure !== undefined ? prefixes.failure : '✗ ',
    pending: prefixes && prefixes.pending !== undefined ? prefixes.pending : '* '
  }
}

SpecPrefixesProcessor.prototype = new DisplayProcessor();

SpecPrefixesProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return this.prefixes.success + log;
};

SpecPrefixesProcessor.prototype.displayFailedSpec = function (spec, log) {
  return this.prefixes.failure + log;
};

SpecPrefixesProcessor.prototype.displayPendingSpec = function (spec, log) {
  return this.prefixes.pending + log;
};

module.exports = SpecPrefixesProcessor;
