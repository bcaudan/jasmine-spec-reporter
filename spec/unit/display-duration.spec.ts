describe('with spec duration enabled', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayDuration: true,
      },
    })
  })

  describe('when spec', () => {
    it('should report success', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('successful spec', () => {
              env.passed()
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(/✓ successful spec \({time}\)/)
          done()
        }
      )
    })

    it('should report failure', (done) => {
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
          expect(outputs).contains(/✗ failed spec \({time}\)/)
          done()
        }
      )
    })
  })
})

describe('with summary duration disabled', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displayDuration: false,
      },
    })
  })

  describe('when summary', () => {
    it('should not display execution duration', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('successful spec', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains('Executed 1 of 1 spec SUCCESS.')
          done()
        }
      )
    })
  })
})
