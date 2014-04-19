require('./test-helper.coffee')

describe 'spec reporter', ->

  it 'should report successful specs', ->
    expect(new Test(->

      @describe "suite", ->
        @it "spec", ->
          @passed()

    ).output.stripColors.stripTime)
    .toBe  """
          Spec started

            suite
              ✓ spec

          Executed 1 of 1 spec SUCCESS in {time}.

          """

  it 'should report failed specs', ->
    expect(new Test(->

      @describe "suite", ->
        @it "spec", ->
          @failed("Expected true to be false.")

    ).output.stripColors.stripTime)
    .toBe  """
           Spec started

             suite
               ✗ spec
                 Message:
                   Expected true to be false.\n

           Executed 1 of 1 spec (1 FAILED) in {time}.

           """

  it 'should report skipped specs', ->
    expect(new Test(->

      @describe "suite", ->
        @xit "spec", ->


    ).output.stripColors.stripTime)
    .toBe  """
           Spec started

             suite

           Executed 0 of 1 spec SUCCESS (skipped 1) in {time}.

           """
