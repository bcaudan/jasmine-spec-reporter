require('../src/jasmine-spec-reporter.js');

describe('first suite', function () {
  var reporter, log;

  beforeEach(function() {
    log = jasmine.createSpy('console.log');
    console.log = log;
    reporter = new jasmine.SpecReporter();
    reporter.reportRunnerStarting();
  })

  it("should be ok", function() {
    reporter.reportSpecStarting({suite: {parentSuite: null, description: "suite"}});
    expect(log).toHaveBeenCalledWith("  suite")
  })
});
