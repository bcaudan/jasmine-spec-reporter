describe('with failed spec disabled', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayFailed: false,
      },
    })
  })

  describe('when spec', () => {
    it('should not report failed', (done) => {
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
          expect(outputs).not.contains(/failed spec/)
          done()
        }
      )
    })
  })

  describe('when suite', () => {
    it('should not display fully failed suite', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('failed suite', () => {
            env.it('spec 1', () => {
              env.failed()
            })
            env.it('spec 2', () => {
              env.failed()
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/failed suite/)
          done()
        }
      )
    })

    it('should display not fully failed suite', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('failed suite', () => {
            env.it('successful spec', () => {
              env.passed()
            })
            env.it('failed spec', () => {
              env.failed()
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(/failed suite/)
          expect(outputs).contains(/successful spec/)
          expect(outputs).not.contains(/failed spec/)
          done()
        }
      )
    })
  })
})
