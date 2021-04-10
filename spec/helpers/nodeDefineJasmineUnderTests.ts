// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface Global {
    getJasmineRequireObj
    jasmineUnderTest
  }
}

;(() => {
  /**
   * adaptation of jasmine `nodeDefineJasmineUnderTests.js` in order to test jasmine with jasmine.
   * See https://github.com/jasmine/jasmine/blob/master/CONTRIBUTING.md#self-testing
   */
  const jasmineUnderTestRequire = require('jasmine-core')

  global.getJasmineRequireObj = () => {
    return jasmineUnderTestRequire
  }

  global.jasmineUnderTest = jasmineUnderTestRequire.core(jasmineUnderTestRequire)
})()
