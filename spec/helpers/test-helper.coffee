require('colors')

String.prototype.__defineGetter__ 'stripTime', ->
  this.replace /(\d+\.?\d*|\.\d+) secs/, '{time}'

typeIsArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'

equalOrMatch = (actual, expected) ->
  expected == actual || (expected.test && expected.test(actual))

addMatchers = ->
  beforeEach ->
    jasmine.addMatchers
      contains: ->
        compare: (actual, sequence) ->
          sequence = [sequence] unless typeIsArray sequence
          i = 0
          while i < actual.length - sequence.length + 1
            j = 0
            while j < sequence.length && equalOrMatch(actual[i + j], sequence[j])
              j++
            return pass: true if j == sequence.length
            i++
          pass: false

class Test
  constructor: (@reporter, @testFn) ->
    @init()
    @run()

  init: ->
    @outputs = []
    @summary = []
    logInSummary = false
    console.log = (stuff) =>
      stuff = stuff.stripColors.stripTime
      logInSummary = true if /^(Executed|\*\*\*\*\*\*\*)/.test stuff

      unless logInSummary
        @outputs.push stuff
      else
        @summary.push stuff

  run: ->
    env = new FakeEnv(@testFn)
    @reporter.jasmineStarted()

    if @hasOnlyOneSuite(@testFn)
        @execSuite env.queue[0]
    else
      for suite in env.queue
        @reporter.suiteStarted(suite)
        @execSuite suite
        @reporter.suiteDone(suite)

    @reporter.jasmineDone()

  execSuite: (suite) ->
    for item in suite.queue
      if @isSpec(item)
        @reporter.specStarted(item)
        @reporter.specDone(item)
      else
        @reporter.suiteStarted(item)
        @execSuite item
        @reporter.suiteDone(item)

  isSpec: (it) ->
    it.queue == undefined

  hasOnlyOneSuite: (testFn) ->
    (testFn.toString().match(/describe/g) || []).length == 1

class FakeEnv
  constructor: (fn) ->
    @queue = []
    fn.apply(@)

  describe: (description, fn) ->
    @queue.push(new Suite(description, description, fn))

class Suite
  constructor: (@description, @fullName, fn) ->
    @queue = []
    fn.apply(@)

  describe: (description, fn) ->
    @queue.push(new Suite(description, @fullName + ' ' + description, fn))

  it: (description, fn) ->
    @queue.push(new Spec(description, @fullName + ' ' + description, fn))

  xit: (description, fn) ->
    spec = new Spec(description, @fullName + ' ' + description, fn)
    spec.status = 'pending'
    @queue.push(spec)

class Spec
  constructor: (@description, @fullName, fn) ->
    @status = ''
    @failedExpectations = []
    fn.apply(@)

  passed: (message = '') ->
    @status = 'passed'

  failed: (message = '') ->
    @status = 'failed'
    @failedExpectations.push {message, stack: 'Error: Expectation\n{Stacktrace}', passed: false}

global.Test = Test
global.addMatchers = addMatchers
