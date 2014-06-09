require('./test-helper.coffee')

describe 'spec reporter', ->
  addMatchers()

  describe 'with default options', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter()

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


      it 'should not report skipped', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'skipped spec', ->
        ).outputs)
        .not.contains /skipped spec/


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
          '      Message:'
          '        first failed assertion'
          ''
          '      Message:'
          '        second failed assertion'
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
          /Executed/
        ]


    describe 'when summary', ->
      it 'should report success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec', ->
              @passed()
        ).outputs)
        .contains 'Executed 1 of 1 spec SUCCESS in {time}.'


      it 'should report failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @it 'spec', ->
              @failed()
        ).outputs)
        .contains 'Executed 1 of 1 spec (1 FAILED) in {time}.'


      it 'should report skipped whith success', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'spec', ->
        ).outputs)
        .contains 'Executed 0 of 1 spec SUCCESS (skipped 1) in {time}.'


      it 'should report skipped whith failure', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'spec', ->
            @it 'spec', ->
              @failed()
        ).outputs)
        .toContain 'Executed 1 of 2 specs (1 FAILED) (skipped 1) in {time}.'


  describe 'with stacktrace enabled', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter({displayStacktrace: true})

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
          '      Message:'
          '        first failed assertion'
          ''
          '      Stacktrace:'
          '        {Stacktrace}'
          ''
        ]


  describe 'with successful spec disabled', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter({displaySuccessfulSpec: false})

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
      @reporter = new jasmine.SpecReporter({displayFailedSpec: false})

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


  describe 'with skipped spec enabled', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter({displaySkippedSpec: true})

    describe 'when spec', ->
      it 'should report skipped', ->
        expect(new Test(@reporter,->
          @describe 'suite', ->
            @xit 'skipped spec', ->
        ).outputs)
        .contains /- skipped spec/


  describe 'with spec duration enabled', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter({displaySpecDuration: true})

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


  describe 'with jasmine callback hack', ->
    beforeEach ->
      @reporter = new jasmine.SpecReporter()
      @spy = jasmine.createSpy('callback')
      @reporter.jasmineCallback = @spy

    it 'should call jasmine callback when runner ends', ->
      new Test(@reporter, ->
        @describe 'suite', ->
          @it 'successful spec', ->
            @passed()
      )
      expect(@spy).toHaveBeenCalled()


describe 'duration', ->
  it 'should be human readable', ->
    secs = 1000
    mins = 60 * secs
    hours = 60 * mins
    reporter = new jasmine.SpecReporter()
    @formatDuration = reporter.metrics.formatDuration
    expect(@formatDuration(0)).toBe '0 secs'
    expect(@formatDuration(10)).toBe '0.01 secs'
    expect(@formatDuration(999)).toBe '0.999 secs'
    expect(@formatDuration(secs)).toBe '1 secs'
    expect(@formatDuration(10 * secs)).toBe '10 secs'
    expect(@formatDuration(59 * secs)).toBe '59 secs'
    expect(@formatDuration(60 * secs)).toBe '1 mins'
    expect(@formatDuration(61 * secs)).toBe '1 mins 1 secs'
    expect(@formatDuration(59 * mins)).toBe '59 mins'
    expect(@formatDuration(60 * mins)).toBe '1 hours'
    expect(@formatDuration(3 * hours + 28 * mins + 53 * secs + 127)).toBe '3 hours 28 mins 53 secs'
    expect(@formatDuration(3 * hours + 53 * secs + 127)).toBe '3 hours 53 secs'
