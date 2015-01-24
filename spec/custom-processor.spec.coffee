require('./helpers/test-helper.coffee')
SpecReporter = require('../src/jasmine-spec-reporter.js')
TestProcessor = require('./helpers/test-processor.js')

describe 'spec reporter', ->
  addMatchers()

  describe 'with custom processor', ->
    beforeEach ->
      @reporter = new SpecReporter
        displayPendingSpec: true
        customProcessors: [TestProcessor]
        test: ' TEST'

    describe 'when suite', ->
      it 'should report suite with custom display', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .contains /suite TEST/

    describe 'when spec', ->
      it 'should report success with custom display', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .contains /successful spec TEST/

      it 'should report failure with custom display', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .contains /failed spec TEST/


      it 'should report pending with custom display', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'pending spec', ->
        ).outputs)
        .contains /pending spec TEST/
