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

    for suite in env.queue
      @execSuite suite

    @reporter.jasmineDone()

  execSuite: (suite) ->
    @reporter.suiteStarted()
    for item in suite.queue
      if @isSpec(item)
        @reporter.specStarted(item)
        @reporter.specDone(item)
      else
        @execSuite item
    @reporter.suiteDone()

  isSpec: (it) -> it.suite != undefined

class FakeEnv
  constructor: (fn) ->
    @nextId = 0
    @queue = []
    fn.apply(@)

  describe: (description, fn) ->
    @queue.push(new Suite(@, null, description, fn))

class Suite
  constructor: (@env, @parentSuite, @description, fn) ->
    @queue = []
    @id = @env.nextId++
    fn.apply(@)

  describe: (description, fn) ->
    @queue.push(new Suite(@env, @, description, fn))

  it: (description, fn) ->
    @queue.push(new Spec(@env, @, description, fn))

  xit: (description, fn) ->
    spec = new Spec(@env, @, description, fn)
    spec.skipped = true
    @queue.push(spec)

class Spec
  constructor: (@env, @suite, @description, fn) ->
    @status = ''
    @items = []
    @id = @env.nextId++
    fn.apply(@)

  results: ->
    description: @description
    passed: => @success
    items_: @items
    skipped: @skipped

  passed: (message = '') ->
    @status = 'passed'
    @items.push {message, passed: -> true}

  failed: (message = '') ->
    @status = 'failed'
    @items.push {message, trace: {stack: 'Error: Expectation\n{Stacktrace}'}, passed: -> false}

global.Test = Test
global.addMatchers = addMatchers
