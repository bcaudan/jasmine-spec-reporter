require('./helpers/test-helper.coffee')
SpecReporter = require('../src/jasmine-spec-reporter.js')

describe 'spec reporter', ->
  addMatchers()

  describe 'with default options', ->
    beforeEach ->
      @reporter = new SpecReporter()

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .contains /✓ successful spec/


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .contains /✗ failed spec/


      it 'should not report pending', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'pending spec', ->
        ).outputs)
        .not.contains /pending spec/


    describe 'when failed spec', ->
      it 'should display with error messages', ->
        outputs = new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed('first failed assertion')
              @passed('passed assertion')
              @failed('second failed assertion')
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - first failed assertion'
          '      - second failed assertion'
          ''
        ]


    describe 'when suite', ->
      it 'should display multiple specs', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec 1', ->
              @passed()
            @it 'spec 2', ->
              @passed()
        ).outputs).contains [
          ''
          '  suite'
          '    ✓ spec 1'
          '    ✓ spec 2'
          ''
        ]


      it 'should display multiple suites', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @it 'spec 1', ->
              @passed()
          @describe 'suite 2', ->
            @it 'spec 2', ->
              @passed()
        ).outputs).contains [
          ''
          '  suite 1'
          '    ✓ spec 1'
          ''
          '  suite 2'
          '    ✓ spec 2'
          ''
        ]


      it 'should display nested suite at first position', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @describe 'suite 2', ->
              @it 'spec 1', ->
                @passed()
            @it 'spec 2', ->
              @passed()
        ).outputs).contains [
          ''
          '  suite 1'
          ''
          '    suite 2'
          '      ✓ spec 1'
          ''
          '    ✓ spec 2'
          ''
        ]


      it 'should display nested suite at last position', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @it 'spec 1', ->
              @passed()
            @describe 'suite 2', ->
              @it 'spec 2', ->
                @passed()
        ).outputs).contains [
          ''
          '  suite 1'
          '    ✓ spec 1'
          ''
          '    suite 2'
          '      ✓ spec 2'
          ''
        ]


      it 'should display multiple nested suites', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @describe 'suite 2', ->
              @it 'spec 2', ->
                @passed()
            @describe 'suite 3', ->
              @it 'spec 3', ->
                @passed()
        ).outputs).contains [
          ''
          '  suite 1'
          ''
          '    suite 2'
          '      ✓ spec 2'
          ''
          '    suite 3'
          '      ✓ spec 3'
          ''
        ]


    describe 'when summary', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec', ->
              @passed()
        ).summary)
        .contains 'Executed 1 of 1 spec SUCCESS in {time}.'


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec', ->
              @failed()
        ).summary)
        .contains 'Executed 1 of 1 spec (1 FAILED) in {time}.'


      it 'should report failures summary', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @it 'spec 1', ->
              @failed('failed assertion 1')
            @describe 'suite 2', ->
              @it 'spec 2', ->
                @failed('failed assertion 2')
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - failed assertion 1'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - failed assertion 2'
          ''
        ]


      it 'should report pending with success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'spec', ->
        ).summary)
        .contains 'Executed 0 of 1 spec SUCCESS (1 PENDING) in {time}.'


      it 'should report pending with failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'spec', ->
            @it 'spec', ->
              @failed()
        ).summary)
        .toContain 'Executed 1 of 2 specs (1 FAILED) (1 PENDING) in {time}.'


      xit 'should report skipped with success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec', ->
            @fit 'spec', ->
        ).summary)
        .toContain 'Executed 1 of 1 specs SUCCESS (1 SKIPPED) in {time}.'


      xit 'should report skipped with failure and pending', ->
        expect(new Test(@reporter,->
          @fdescribe 'suite', ->
            @xit 'spec', ->
            @it 'spec', ->
              @failed()
          @describe 'suite', ->
            @it 'spec', ->
            @xit 'spec', ->
        ).summary)
        .toContain 'Executed 1 of 2 specs (1 FAILED) (1 PENDING) (2 SKIPPED) in {time}.'


  describe 'with stacktrace enabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displayStacktrace: true})

    describe 'when failed spec', ->
      it 'should display with error messages with stacktraces', ->
        outputs = new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed('first failed assertion')
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - first failed assertion'
          '      {Stacktrace}'
          ''
        ]


    describe 'when summary', ->
      it 'should report failures summary with stacktraces', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @it 'spec 1', ->
              @failed('failed assertion 1')
            @describe 'suite 2', ->
              @it 'spec 2', ->
                @failed('failed assertion 2')
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - failed assertion 1'
          '  {Stacktrace}'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - failed assertion 2'
          '  {Stacktrace}'
          ''
        ]


  describe 'with failures summary disabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displayFailuresSummary: false})

    describe 'when summary', ->
      it 'should not report failures summary', ->
        expect(new Test(@reporter,->
          @describe 'suite 1', ->
            @it 'spec 1', ->
              @failed('failed assertion 1')
            @describe 'suite 2', ->
              @it 'spec 2', ->
                @failed('failed assertion 2')
        ).summary).not.contains /Failures:/


  describe 'with successful spec disabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displaySuccessfulSpec: false})

    describe 'when spec', ->
      it 'should not report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .not.contains /successful spec/


    describe 'when suite', ->
      it 'should not display successful suite', ->
        outputs = new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec 1', ->
              @passed()
            @it 'spec 2', ->
              @passed()
        ).outputs

        expect(outputs).not.contains /suite/


      it 'should display failed suite', ->
        outputs = new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
            @it 'successful spec', ->
              @passed()
        ).outputs

        expect(outputs).contains /suite/
        expect(outputs).contains /failed spec/
        expect(outputs).not.contains /successful spec/


  describe 'with failed spec disabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displayFailedSpec: false})

    describe 'when spec', ->
      it 'should not report failed', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .not.contains /failed spec/


    describe 'when suite', ->
      it 'should not display fully failed suite', ->
        expect(new Test(@reporter,->
          @describe 'failed suite', ->
            @it 'spec 1', ->
              @failed()
            @it 'spec 2', ->
              @failed()
        ).outputs).not.contains /failed suite/


      it 'should display not fully failed suite', ->
        outputs = new Test(@reporter,->
          @describe 'failed suite', ->
            @it 'successful spec', ->
              @passed()
            @it 'failed spec', ->
              @failed()
        ).outputs

        expect(outputs).contains /failed suite/
        expect(outputs).contains /successful spec/
        expect(outputs).not.contains /failed spec/


  describe 'with pending spec enabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displayPendingSpec: true})

    describe 'when spec', ->
      it 'should report pending', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'pending spec', ->
        ).outputs)
        .contains /- pending spec/


  describe 'with spec duration enabled', ->
    beforeEach ->
      @reporter = new SpecReporter({displaySpecDuration: true})

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .contains /✓ successful spec \({time}\)/


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .contains /✗ failed spec \({time}\)/


  describe 'with prefixes set to empty strings', ->
    beforeEach ->
      @reporter = new SpecReporter({displayPendingSpec: true, prefixes: {success: '', failure: '', pending: ''}})
 
    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .not.contains /✓/


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .not.contains /✗/


      it 'should report pending', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'pending spec', ->
        ).outputs)
        .not.contains /-/


  describe 'with prefixes set to valid strings', ->
    beforeEach ->
      @reporter = new SpecReporter({displayPendingSpec: true, prefixes: {success: 'Pass ', failure: 'Fail ', pending: 'Skip '}})

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'successful spec', ->
              @passed()
        ).outputs)
        .not.contains /✓/


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'failed spec', ->
              @failed()
        ).outputs)
        .not.contains /✗/


      it 'should report pending', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'pending spec', ->
        ).outputs)
        .not.contains /-/
