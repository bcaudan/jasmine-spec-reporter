beforeAll ->
  require('./test-helper.coffee')
  addMatchers()
  global.SpecReporter = require('../../built/main').SpecReporter
  global.TestProcessor = require('./test-processor.js')
