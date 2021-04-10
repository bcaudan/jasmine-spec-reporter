const SpecReporter = require('jasmine-spec-reporter').SpecReporter

exports.config = {
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    defaultTimeoutInterval: 360000,
    print () {},
  },
  specs: ['./spec/protractor-spec.js'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--test-type'],
    },
  },
  logLevel: 'WARN',
  onPrepare () {
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
        },
        summary: {
          displayDuration: false,
        },
      })
    )
  },
}
