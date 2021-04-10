describe('duration', () => {
  it('should be human readable', () => {
    const secs = 1000
    const mins = 60 * secs
    const hours = 60 * mins
    this.reporter = new global.SpecReporter()
    this.formatDuration = this.reporter.metrics.formatDuration
    expect(this.formatDuration(0)).toBe('0 sec')
    expect(this.formatDuration(10)).toBe('0.01 sec')
    expect(this.formatDuration(999)).toBe('0.999 sec')
    expect(this.formatDuration(secs)).toBe('1 sec')
    expect(this.formatDuration(10 * secs)).toBe('10 secs')
    expect(this.formatDuration(59 * secs)).toBe('59 secs')
    expect(this.formatDuration(60 * secs)).toBe('1 min')
    expect(this.formatDuration(61 * secs)).toBe('1 min 1 sec')
    expect(this.formatDuration(mins + 59 * secs)).toBe('1 min 59 secs')
    expect(this.formatDuration(30 * mins + 30 * secs)).toBe('30 mins 30 secs')
    expect(this.formatDuration(59 * mins)).toBe('59 mins')
    expect(this.formatDuration(60 * mins)).toBe('1 hour')
    expect(this.formatDuration(61 * mins)).toBe('1 hour 1 min')
    expect(this.formatDuration(3 * hours + 28 * mins + 53 * secs + 127)).toBe('3 hours 28 mins 53 secs')
    expect(this.formatDuration(3 * hours + 53 * secs + 127)).toBe('3 hours 53 secs')
  })
})
