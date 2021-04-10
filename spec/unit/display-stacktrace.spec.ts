describe("With spec display stacktrace 'raw' enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayStacktrace: 'raw',
      },
    })
  })

  describe('when failed spec', () => {
    it('should display with error messages with raw stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.failed()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/passed assertion/)
          expect(outputs).contains([
            '    ✗ failed spec',
            '      - Expected true to be false.',
            /at <Jasmine>/,
            /at Env\.env\.failed/,
            /at UserContext\.<anonymous>/,
            /at <Jasmine>/,
            '',
          ])
          done()
        }
      )
    })
  })

  describe('when summary', () => {
    it('should not report raw stacktraces in failures summary', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.expect(true).toBe(false)
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.expect(2).toBe(1)
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains([
            /.*/,
            /Failures/,
            /.*/,
            '',
            '1) suite 1 spec 1',
            '  - Expected true to be false.',
            '',
            '2) suite 1 suite 2 spec 2',
            '  - Expected 2 to be 1.',
            '',
          ])
          done()
        }
      )
    })
  })
})

describe("With summary display stacktrace 'raw' enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displayStacktrace: 'raw',
      },
    })
  })

  describe('when failed spec', () => {
    it('should not display raw stacktraces with error messages', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.failed()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/passed assertion/)
          expect(outputs).contains(['    ✗ failed spec', '      - Expected true to be false.', ''])
          done()
        }
      )
    })
  })

  describe('when summary', () => {
    it('should report failures summary with raw stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.expect(true).toBe(false)
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.expect(2).toBe(1)
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains([
            /.*/,
            /Failures/,
            /.*/,
            '',
            '1) suite 1 spec 1',
            '  - Expected true to be false.',
            /at <Jasmine>/,
            /at UserContext\.<anonymous>/,
            /at <Jasmine>/,
            '',
            '2) suite 1 suite 2 spec 2',
            '  - Expected 2 to be 1.',
            /at <Jasmine>/,
            /at UserContext\.<anonymous>/,
            /at <Jasmine>/,
            '',
          ])
          done()
        }
      )
    })
  })
})

describe("With spec display stacktrace 'pretty' enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayStacktrace: 'pretty',
      },
    })
  })

  describe('when failed spec', () => {
    it('should display with error messages with pretty stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.failedWithFakeStack()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/passed assertion/)
          expect(outputs).contains([
            '    ✗ failed spec',
            '      - Error: oops',
            '',
            /test-helper.js:\d+:\d+/,
            '                          return {',
            '                              compare: function () {',
            "                                  throw new Error('oops');",
            '                                        ~',
            '                              },',
            '                          };',
            '',
            /test-helper.js:\d+:\d+/,
            '                      },',
            '                  });',
            '                  env.expect().throw();',
            '                                    ~',
            '              };',
            '              testFn(env);',
            '',
            /display-stacktrace.spec.js:\d+:\d+/,
            "                      env.describe('suite', function () {",
            "                          env.it('failed spec', function () {",
            '                              env.failedWithFakeStack();',
            '                                  ~',
            '                          });',
            '                      });',
            '',
          ])
          done()
        }
      )
    })
  })

  describe('when summary', () => {
    it('should not report pretty stacktraces in failures summary', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.failedWithFakeStack()
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.failedWithFakeStack()
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains([
            /.*/,
            /Failures/,
            /.*/,
            '',
            '1) suite 1 spec 1',
            '  - Error: oops',
            '',
            '2) suite 1 suite 2 spec 2',
            '  - Error: oops',
            '',
          ])
          done()
        }
      )
    })
  })
})

describe("With summary display stacktrace 'pretty' enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displayStacktrace: 'pretty',
      },
    })
  })

  describe('when failed spec', () => {
    it('should not display pretty stacktraces with error messages', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.failedWithFakeStack()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/passed assertion/)
          expect(outputs).contains(['    ✗ failed spec', '      - Error: oops', ''])
          done()
        }
      )
    })
  })

  describe('when summary', () => {
    it('should report failures summary with pretty stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.failedWithFakeStack()
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.failedWithFakeStack()
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains([
            /.*/,
            /Failures/,
            /.*/,
            '',
            '1) suite 1 spec 1',
            '  - Error: oops',
            '',
            /test-helper.js:\d+:\d+/,
            '                      return {',
            '                          compare: function () {',
            "                              throw new Error('oops');",
            '                                    ~',
            '                          },',
            '                      };',
            '',
            /test-helper.js:\d+:\d+/,
            '                  },',
            '              });',
            '              env.expect().throw();',
            '                                ~',
            '          };',
            '          testFn(env);',
            '',
            /display-stacktrace.spec.js:\d+:\d+/,
            "                  env.describe('suite 1', function () {",
            "                      env.it('spec 1', function () {",
            '                          env.failedWithFakeStack();',
            '                              ~',
            '                      });',
            "                      env.describe('suite 2', function () {",
            '',
            '',
            '2) suite 1 suite 2 spec 2',
            '  - Error: oops',
            '',
            /test-helper.js:\d+:\d+/,
            '                      return {',
            '                          compare: function () {',
            "                              throw new Error('oops');",
            '                                    ~',
            '                          },',
            '                      };',
            '',
            /test-helper.js:\d+:\d+/,
            '                  },',
            '              });',
            '              env.expect().throw();',
            '                                ~',
            '          };',
            '          testFn(env);',
            '',
            /display-stacktrace.spec.js:\d+:\d+/,
            "                      env.describe('suite 2', function () {",
            "                          env.it('spec 2', function () {",
            '                              env.failedWithFakeStack();',
            '                                  ~',
            '                          });',
            '                      });',
            '',
            '',
          ])
          done()
        }
      )
    })
  })
})

describe('With custom stacktrace filter function', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayStacktrace: 'raw',
      },
      stacktrace: {
        filter: () => {
          return 'Updated stacktrace'
        },
      },
      summary: {
        displayStacktrace: 'raw',
      },
    })
  })

  describe('when failed spec', () => {
    it('should filter stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.failed()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/at Object\.<anonymous>/)
          expect(outputs).contains(/Updated stacktrace/)
          done()
        }
      )
    })
  })

  describe('when summary', () => {
    it('should filter stacktraces', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.expect(true).toBe(false)
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.expect(2).toBe(1)
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).not.contains(/at Object\.<anonymous>/)
          expect(summary).contains(/Updated stacktrace/)
          done()
        }
      )
    })
  })
})
