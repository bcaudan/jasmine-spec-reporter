require('colors')
require('../src/jasmine-spec-reporter.js')

String.prototype.__defineGetter__ 'stripTime', ->
  this.replace /(\d+\.?\d*|\.\d+) secs/, '{time}'

class Test
  constructor: (@testFn) ->
    @init()
    @run()

  init: ->
    @output = ''
    console.log = (stuff) =>
      @output += "#{stuff}\n"
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

class Spec
  constructor: (@env, @suite, @description, fn) ->
    @success = false
    @items = []
    @id = @env.nextId++
    fn.apply(@)

  results: ->
    description: @description
    passed: => @success
    items_: @items

  passed: (message) ->
    @success = true
    @items.push {message, passed: -> true}

  failed: (message) ->
    @success = false
    @items.push {message, passed: -> false}

global.Test = Test
