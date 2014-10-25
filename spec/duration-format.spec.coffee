SpecReporter = require('../src/jasmine-spec-reporter.js')

describe 'duration', ->
  it 'should be human readable', ->
    secs = 1000
    mins = 60 * secs
    hours = 60 * mins
    reporter = new SpecReporter()
    @formatDuration = reporter.metrics.formatDuration
    expect(@formatDuration(0)).toBe '0 secs'
    expect(@formatDuration(10)).toBe '0.01 secs'
    expect(@formatDuration(999)).toBe '0.999 secs'
    expect(@formatDuration(secs)).toBe '1 secs'
    expect(@formatDuration(10 * secs)).toBe '10 secs'
    expect(@formatDuration(59 * secs)).toBe '59 secs'
    expect(@formatDuration(60 * secs)).toBe '1 mins'
    expect(@formatDuration(61 * secs)).toBe '1 mins 1 secs'
    expect(@formatDuration(59 * mins)).toBe '59 mins'
    expect(@formatDuration(60 * mins)).toBe '1 hours'
    expect(@formatDuration(3 * hours + 28 * mins + 53 * secs + 127)).toBe '3 hours 28 mins 53 secs'
    expect(@formatDuration(3 * hours + 53 * secs + 127)).toBe '3 hours 53 secs'
