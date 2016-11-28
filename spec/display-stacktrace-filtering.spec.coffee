describe 'with filterDomain', ->
  describe 'with "/jasmine-spec-reporter" filtering', ->
    beforeEach ->
      @reporter = new SpecReporter(filterDomain: 'display-stacktrace-filtering.spec.coffee', displayStacktrace:'all')

    it 'should contains "at Object.<anonymous>" stracktrace', ->
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

    it 'should not contains "at Test.run" stacktrace', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @expect(true).toBe false
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @expect(2).toBe 1
      ).summary).not.contains [
        /at Test\.run/
      ]


  describe 'undefined', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace:'all')

    it 'should contains "at Object" stracktrace', ->
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

    it 'should contains "at Test.run" stacktrace', ->
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
        /at Test\.run/
        ''
        '2) suite 1 suite 2 spec 2'
        '  - Expected 2 to be 1.'
        /at Test\.run/
        ''
      ]
