require('colors')
require('../src/jasmine-spec-reporter.js')

String.prototype.__defineGetter__ 'stripTime', ->
  this.replace /(\d+\.?\d*|\.\d+) secs/, '{time}'

class Test
  constructor: (@test) ->
    @init()
    @run()

  init: ->
    @output = ''
    console.log = (stuff) =>
      @output += "#{stuff}\n"
    @reporter = new jasmine.SpecReporter()

  run: ->
    @reporter.reportRunnerStarting()
    @reporter.reportSpecStarting(@test)
    @reporter.reportSpecResults(@test)
    @reporter.reportSuiteResults()
    @reporter.reportRunnerResults()

global.Test = Test
