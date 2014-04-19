require('./test-helper.coffee')

describe 'spec reporter', ->

  it 'should be ok', ->
    expect(new Test(
      suite:
        parentSuite: null
        description: "suite"
      results: ->
        description: "spec"
        passed: -> true
    ).output.stripColors.stripTime)
    .toBe  """
          Spec started

            suite
              ✓ spec

          Executed 1 of 1 spec SUCCESS in {time}.

          """
