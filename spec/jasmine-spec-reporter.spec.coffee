require('../src/jasmine-spec-reporter.js')

describe 'first suite', ->

  beforeEach ->
    @log = jasmine.createSpy 'console.log'
    console.log = @log
    @reporter = new jasmine.SpecReporter()
    @reporter.reportRunnerStarting()

  it 'should be ok', ->
    @reporter.reportSpecStarting({suite: {parentSuite: null, description: "suite"}})
    expect(@log).toHaveBeenCalledWith("  suite")
