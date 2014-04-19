require('colors')
require('../src/jasmine-spec-reporter.js')

String.prototype.__defineGetter__ 'stripTime', ->
  this.replace /(\d+\.?\d*|\.\d+) secs/, '{time}'

class Test
  constructor: (@testFn) ->
    @init()
    @run()

  init: ->
    @outputs = []
    console.log = (stuff) =>
      @outputs.push stuff.stripColors.stripTime
    @reporter = new jasmine.SpecReporter()

  run: ->
    env = new FakeEnv(@testFn)
    @reporter.reportRunnerStarting()

    for suite in env.queue
      @execSuite suite

    @reporter.reportRunnerResults()

  execSuite: (suite) ->
    for item in suite.queue
      if @isSpec(item)
        @reporter.reportSpecStarting(item)
        @reporter.reportSpecResults(item)
      else
        @execSuite item
    @reporter.reportSuiteResults()

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
    @success = false
    @skipped = false
    @items = []
    @id = @env.nextId++
    fn.apply(@)

  results: ->
    description: @description
    passed: => @success
    items_: @items
    skipped: @skipped

  passed: (message = '') ->
    @success = true
    @items.push {message, passed: -> true}

  failed: (message = '') ->
    @success = false
    @items.push {message, passed: -> false}

global.Test = Test
