beforeAll ->
  require('./test-helper.coffee')
  addMatchers()
  global.SpecReporter = require('../../dist/jasmine-spec-reporter.js')
  global.TestProcessor = require('./test-processor.js')
