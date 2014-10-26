var DisplayProcessor = require('../display-processor');

function SpecPrefixesProcessor(prefixes) {
  this.prefixes = {
    success: prefixes && prefixes.success !== undefined ? prefixes.success : '✓ ',
    failure: prefixes && prefixes.failure !== undefined ? prefixes.failure : '✗ ',
    skipped: prefixes && prefixes.skipped !== undefined ? prefixes.skipped : '- '
  }
}

SpecPrefixesProcessor.prototype = new DisplayProcessor();

SpecPrefixesProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return this.prefixes.success + log;
};

SpecPrefixesProcessor.prototype.displayFailedSpec = function (spec, log) {
  return this.prefixes.failure + log;
};

SpecPrefixesProcessor.prototype.displaySkippedSpec = function (spec, log) {
  return this.prefixes.skipped + log;
};

module.exports = SpecPrefixesProcessor;
