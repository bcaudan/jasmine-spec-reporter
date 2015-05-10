require('./helpers/test-helper.coffee')
SpecReporter = require('../src/jasmine-spec-reporter.js')

describe 'spec reporter', ->
  addMatchers()

  describe 'with default options', ->
    beforeEach ->
      @reporter = new SpecReporter()

    describe 'when jasmine started', ->
      it 'should report start', ->
        expect(new Test(@reporter, ->
          # no spec needed
        ).outputs)
        .contains /Spec started/


    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs)
        .contains /✓ successful spec/


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs)
        .contains /✗ failed spec/


      it 'should not report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs)
        .not.contains /pending spec/


    describe 'when failed spec', ->
      it 'should display with error messages', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @expect(true).toBe false
              @passed()
              @expect(2).toBe 1
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          '      - Expected 2 to be 1.'
          ''
        ]


    describe 'when suite', ->
      it 'should display multiple specs', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'spec 1', =>
              @passed()
            @it 'spec 2', =>
              @passed()
        ).outputs).contains [
          ''
          '  suite'
          '    ✓ spec 1'
          '    ✓ spec 2'
          ''
        ]


      it 'should display multiple suites', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @passed()
          @describe 'suite 2', =>
            @it 'spec 2', =>
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
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @describe 'suite 2', =>
              @it 'spec 1', =>
                @passed()
            @it 'spec 2', =>
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
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @passed()
            @describe 'suite 2', =>
              @it 'spec 2', =>
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
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @passed()
            @describe 'suite 3', =>
              @it 'spec 3', =>
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
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'spec', =>
              @passed()
        ).summary)
        .contains 'Executed 1 of 1 spec SUCCESS in {time}.'


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'spec', =>
              @failed()
        ).summary)
        .contains 'Executed 1 of 1 spec (1 FAILED) in {time}.'


      it 'should report failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          ''
        ]


      it 'should report pending with success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'spec', =>
        ).summary)
        .contains 'Executed 0 of 1 spec SUCCESS (1 PENDING) in {time}.'


      it 'should report pending with failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'spec', =>
            @it 'spec', =>
              @failed()
        ).summary)
        .toContain 'Executed 1 of 2 specs (1 FAILED) (1 PENDING) in {time}.'


      it 'should report skipped with success', ->
        pending('buggy may be related to #28')
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'spec', =>
            @fit 'spec', =>
              @passed()
        ).summary)
        .toContain 'Executed 1 of 1 specs SUCCESS (1 SKIPPED) in {time}.'

      it 'should report skipped with failure and pending', ->
        pending('buggy may be related to #28')
        expect(new Test(@reporter, ->
          @fdescribe 'suite', =>
            @xit 'spec', =>
            @it 'spec', =>
              @failed()
          @describe 'suite', =>
            @it 'spec', =>
            @xit 'spec', =>
        ).summary)
        .toContain 'Executed 1 of 2 specs (1 FAILED) (1 PENDING) (2 SKIPPED) in {time}.'


  describe 'with stacktrace "all" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'all')

    describe 'when failed spec', ->
      it 'should display with error messages with stacktraces', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
        ]


    describe 'when summary', ->
      it 'should report failures summary with stacktraces', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          /at Object\.<anonymous>/
          ''
        ]


  describe 'with stacktrace "specs" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'specs')

    describe 'when failed spec', ->
      it 'should display with error messages with stacktraces', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
        ]


    describe 'when summary', ->
      it 'should not report stacktraces in failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          ''
        ]


  describe 'with stacktrace "summary" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'summary')

    describe 'when failed spec', ->
      it 'should not display stacktraces with error messages', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          ''
        ]


    describe 'when summary', ->
      it 'should report failures summary with stacktraces', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          /at Object\.<anonymous>/
          ''
        ]


  describe 'with stacktrace "none" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'none')

    describe 'when failed spec', ->
      it 'should not display stacktraces with error messages', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          ''
        ]


    describe 'when summary', ->
      it 'should not report stacktraces in failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          ''
        ]


  describe 'with failures summary disabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayFailuresSummary: false)

    describe 'when summary', ->
      it 'should not report failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @failed()
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @failed()
        ).summary).not.contains /Failures:/


  describe 'with successful spec disabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displaySuccessfulSpec: false)

    describe 'when spec', ->
      it 'should not report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs)
        .not.contains /successful spec/


    describe 'when suite', ->
      it 'should display successful suite', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'spec 1', =>
              @passed()
            @it 'spec 2', =>
              @passed()
        ).outputs

        expect(outputs).contains /suite/


      it 'should display failed suite', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
            @it 'successful spec', =>
              @passed()
        ).outputs

        expect(outputs).contains /suite/
        expect(outputs).contains /failed spec/
        expect(outputs).not.contains /successful spec/


  describe 'with failed spec disabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayFailedSpec: false)

    describe 'when spec', ->
      it 'should not report failed', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs)
        .not.contains /failed spec/


    describe 'when suite', ->
      it 'should display fully failed suite', ->
        expect(new Test(@reporter, ->
          @describe 'failed suite', =>
            @it 'spec 1', =>
              @failed()
            @it 'spec 2', =>
              @failed()
        ).outputs).contains /failed suite/


      it 'should display not fully failed suite', ->
        outputs = new Test(@reporter, ->
          @describe 'failed suite', =>
            @it 'successful spec', =>
              @passed()
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).contains /failed suite/
        expect(outputs).contains /successful spec/
        expect(outputs).not.contains /failed spec/


  describe 'with pending spec enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true)

    describe 'when spec', ->
      it 'should report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs)
        .contains /- pending spec/


  describe 'with spec duration enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displaySpecDuration: true)

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs)
        .contains /✓ successful spec \({time}\)/


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs)
        .contains /✗ failed spec \({time}\)/


  describe 'with prefixes set to empty strings', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true, prefixes: {success: '', failure: '', pending: ''})
 
    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs)
        .not.contains /✓/


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs)
        .not.contains /✗/


      it 'should report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs)
        .not.contains /-/


  describe 'with prefixes set to valid strings', ->
    beforeEach ->
      @reporter = new SpecReporter({displayPendingSpec: true, prefixes: {success: 'Pass ', failure: 'Fail ', pending: 'Pend '}})

    describe 'when spec', ->
      it 'should report success', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs

        expect(outputs).not.contains /✓/
        expect(outputs).contains /Pass /


      it 'should report failure', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /✗/
        expect(outputs).contains /Fail /


      it 'should report pending', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs

        expect(outputs).not.contains /-/
        expect(outputs).contains /Pend /
