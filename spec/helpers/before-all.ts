// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface Global {
    SpecReporter
    DisplayProcessor
    TestProcessor
    colors
  }
}

global.SpecReporter = require('../../built/main').SpecReporter
global.DisplayProcessor = require('../../built/main').DisplayProcessor
global.TestProcessor = require('./test-processor').TestProcessor
global.colors = require('colors/safe')

beforeAll(() => {
  const addMatchers = require('./test-helper').addMatchers
  addMatchers()
})
