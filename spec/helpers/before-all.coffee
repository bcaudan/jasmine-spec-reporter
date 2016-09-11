beforeAll ->
  require('./test-helper.coffee')
  addMatchers()
  global.SpecReporter = require('../../built/jasmine-spec-reporter.js')
  global.TestProcessor = require('./test-processor.js')
