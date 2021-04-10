describe('spec reporter', () => {
  let customOutpouts: string[]

  describe('with custom print', () => {
    beforeEach(() => {
      customOutpouts = []
      this.reporter = new global.SpecReporter({
        colors: {
          enabled: false,
        },
        print: (line) => {
          customOutpouts.push(line)
        },
        spec: {
          displayPending: true,
        },
      })
    })

    describe('when jasmine started', () => {
      it('should report start with ', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(/Jasmine started/)
            done()
          }
        )
      })
    })

    describe('when suite', () => {
      it('should report suite with custom print', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(/suite/)
            done()
          }
        )
      })
    })

    describe('when spec started', () => {
      it('should report start', (done) => {
        JasmineEnv.execute(
          this.reporter,
          (env) => {
            env.describe('suite', () => {
              env.it('spec to be started', () => {
                env.passed()
              })
            })
          },
          (outputs) => {
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(['  suite', '    ' + global.colors.green('✓ spec to be started')])
            done()
          }
        )
      })
    })

    describe('when spec done', () => {
      it('should report success with custom print', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(/successful spec/)
            done()
          }
        )
      })

      it('should report failure with custom print', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains([/failed spec/])
            done()
          }
        )
      })

      it('should display spec error messages with custom print', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(['      - Expected true to be false.'])
            done()
          }
        )
      })

      it('should report pending with custom print', (done) => {
        JasmineEnv.execute(
          this.reporter,
          (env) => {
            env.describe('suite', () => {
              env.xit('pending spec', () => {
                env.passed()
              })
            })
          },
          (outputs) => {
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(/pending spec/)
            done()
          }
        )
      })
    })

    describe('when summary', () => {
      it('should display summary error messages with custom print', (done) => {
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
            expect(outputs.length).toEqual(0)
            expect(customOutpouts).contains(['  - Expected true to be false.'])
            done()
          }
        )
      })
    })
  })
})
