describe 'with successes summary enabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displaySuccessesSummary: true)

  describe 'when summary', ->
    it 'should report successes summary', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @passed()
      ).summary).contains /Successes/
