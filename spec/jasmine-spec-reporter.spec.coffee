require('./test-helper.coffee')

describe 'spec reporter', ->
  addMatchers()

  describe 'when spec', ->

    it 'should report success', ->
      expect(new Test(->
        @describe 'suite', ->
          @it 'successfull spec', ->
            @passed()
      ).outputs)
      .contains /✓ successfull spec/


    it 'should report failure', ->
      expect(new Test(->
        @describe 'suite', ->
          @it 'failed spec', ->
            @failed()
      ).outputs)
      .contains /✗ failed spec/


    it 'should not report skipped', ->
      expect(new Test(->
        @describe 'suite', ->
          @xit 'skipped spec', ->
      ).outputs)
      .not.contains /skipped spec/


  describe 'when failed spec', ->

    it 'should display with error messages', ->
      outputs = new Test(->
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
        '        second failed assertion'
        ''
      ]


  describe 'when suite', ->

    it 'should display multiple specs', ->
      expect(new Test(->
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
      expect(new Test(->
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
      expect(new Test(->
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
      expect(new Test(->
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
      expect(new Test(->
        @describe 'suite', ->
          @it 'spec', ->
            @passed()
      ).outputs)
      .contains  'Executed 1 of 1 spec SUCCESS in {time}.'


    it 'should report failure', ->
      expect(new Test(->
        @describe 'suite', ->
          @it 'spec', ->
            @failed()
      ).outputs)
      .contains  'Executed 1 of 1 spec (1 FAILED) in {time}.'


    it 'should report skipped whith success', ->
      expect(new Test(->
        @describe 'suite', ->
          @xit 'spec', ->
      ).outputs)
      .contains  'Executed 0 of 1 spec SUCCESS (skipped 1) in {time}.'


    it 'should report skipped whith failure', ->
      expect(new Test(->
        @describe 'suite', ->
          @xit 'spec', ->
          @it 'spec', ->
            @failed()
      ).outputs)
      .toContain  'Executed 1 of 2 specs (1 FAILED) (skipped 1) in {time}.'
