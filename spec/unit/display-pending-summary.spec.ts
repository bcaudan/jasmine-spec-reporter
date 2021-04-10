describe('with pending summary disabled', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displayPending: false,
      },
    })
  })

  describe('when summary', () => {
    it('should not report pending summary', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.xit('spec 1', () => {
              env.failed()
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.pending()
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).not.contains(/Pending/)
          done()
        }
      )
    })
  })
})
