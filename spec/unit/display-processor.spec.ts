describe('spec reporter', () => {
  describe('with display processor', () => {
    beforeEach(() => {
      this.reporter = new global.SpecReporter({
        customProcessors: [global.DisplayProcessor],
        spec: {
          displayPending: true,
        },
      })
    })

    describe('when jasmine started', () => {
      it('should report start', (done) => {
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
            expect(outputs).contains(/Jasmine started/)
            done()
          }
        )
      })
    })

    describe('when suite', () => {
      it('should report suite', (done) => {
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
            expect(outputs).contains(/suite/)
            done()
          }
        )
      })
    })

    describe('when spec started', () => {
      it('should not report start', (done) => {
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
            expect(outputs).contains(['  suite', '    ✓ spec to be started'])
            done()
          }
        )
      })
    })

    describe('when spec done', () => {
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
            expect(outputs).contains(/successful spec/)
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
            expect(outputs).contains([/failed spec/])
            done()
          }
        )
      })

      it('should display spec error messages', (done) => {
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
            expect(outputs).contains(['      - Expected true to be false.'])
            done()
          }
        )
      })

      it('should report pending', (done) => {
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
            expect(outputs).contains(/pending spec/)
            done()
          }
        )
      })
    })

    describe('when suite done', () => {
      it('should report errors in afterAll', (done) => {
        JasmineEnv.execute(
          this.reporter,
          (env) => {
            env.describe('suite', () => {
              env.it('passing spec', () => {
                env.passed()
              })
              env.afterAll(() => {
                throw new Error('throw in afterAll in suite')
              })
            })
          },
          (outputs) => {
            expect(outputs).contains(/throw in afterAll/)
            done()
          }
        )
      })
    })

    describe('when jasmine done', () => {
      it('should report errors in afterAll', (done) => {
        JasmineEnv.execute(
          this.reporter,
          (env) => {
            env.describe('suite', () => {
              env.it('passing spec', () => {
                env.passed()
              })
            })
            env.afterAll(() => {
              throw new Error('throw in afterAll')
            })
          },
          (outputs) => {
            expect(outputs).contains(/throw in afterAll/)
            done()
          }
        )
      })
    })

    describe('when summary', () => {
      it('should display summary error messages', (done) => {
        JasmineEnv.execute(
          this.reporter,
          (env) => {
            env.describe('suite', () => {
              env.it('failed spec', () => {
                env.failed()
              })
            })
          },
          (outputs, summary) => {
            expect(summary).contains(['  - Expected true to be false.'])
            done()
          }
        )
      })
    })
  })
})
