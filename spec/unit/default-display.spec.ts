describe('with default display', () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter()
  })

  describe('when jasmine started', () => {
    it('should report start', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.it('successful spec', () => {
            env.passed()
          })
        },
        (outputs) => {
          expect(outputs).contains(/Jasmine started/)
          done()
        }
      )
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
          expect(outputs).contains(/✓ successful spec/)
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
          expect(outputs).contains(/✗ failed spec/)
          done()
        }
      )
    })

    it('should not report pending', (done) => {
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
          expect(outputs).not.contains(/pending spec/)
          done()
        }
      )
    })
  })

  describe('when failed spec', () => {
    it('should display with error messages', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('failed spec', () => {
              env.expect(true).toBe(false)
              env.passed()
              env.expect(2).toBe(1)
            })
          })
        },
        (outputs) => {
          expect(outputs).not.contains(/passed assertion/)
          expect(outputs).contains([
            '    ✗ failed spec',
            '      - Expected true to be false.',
            '      - Expected 2 to be 1.',
            '',
          ])
          done()
        }
      )
    })
  })

  describe('when suite', () => {
    it('should display top level suite', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.it('spec 1', () => {
            env.passed()
          })
          env.it('spec 2', () => {
            env.passed()
          })
        },
        (outputs) => {
          expect(outputs).contains(['  Top level suite', '    ✓ spec 1', '    ✓ spec 2', ''])
          done()
        }
      )
    })

    it('should display multiple specs', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec 1', () => {
              env.passed()
            })
            env.it('spec 2', () => {
              env.passed()
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(['', '  suite', '    ✓ spec 1', '    ✓ spec 2', ''])
          done()
        }
      )
    })

    it('should display multiple suites', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.passed()
            })
          })
          env.describe('suite 2', () => {
            env.it('spec 2', () => {
              env.passed()
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(['', '  suite 1', '    ✓ spec 1', '', '  suite 2', '    ✓ spec 2', ''])
          done()
        }
      )
    })

    it('should display nested suite at first position', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.describe('suite 2', () => {
              env.it('spec 1', () => {
                env.passed()
              })
            })
            env.it('spec 2', () => {
              env.passed()
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(['', '  suite 1', '', '    suite 2', '      ✓ spec 1', '', '    ✓ spec 2', ''])
          done()
        }
      )
    })

    it('should display nested suite at last position', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.passed()
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.passed()
              })
            })
          })
        },
        (outputs) => {
          expect(outputs).contains(['', '  suite 1', '    ✓ spec 1', '', '    suite 2', '      ✓ spec 2', ''])
          done()
        }
      )
    })

    it('should display multiple nested suites', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.passed()
              })
            })
            env.describe('suite 3', () => {
              env.it('spec 3', () => {
                env.passed()
              })
            })
          })
        },
        (outputs) => {
          expect(outputs).contains([
            '',
            '  suite 1',
            '',
            '    suite 2',
            '      ✓ spec 2',
            '',
            '    suite 3',
            '      ✓ spec 3',
            '',
          ])
          done()
        }
      )
    })

    it('should not display empty suite', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.passed()
            })
          })
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          env.describe('empty suite', () => {})
        },
        (outputs) => {
          expect(outputs).contains(['  suite 1', '    ✓ spec 1', ''])
          expect(outputs).not.contains(/empty suite/)
          done()
        }
      )
    })
  })

  describe('summary', () => {
    it('should report success', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains('Executed 1 of 1 spec SUCCESS in {time}.')
          done()
        }
      )
    })

    it('should not report successes summary', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).not.contains(/Successes/)
          done()
        }
      )
    })

    it('should report failure', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.failed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains('Executed 1 of 1 spec (1 FAILED) in {time}.')
          done()
        }
      )
    })

    it('should report failures summary', (done) => {
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

    it('should report failures summary', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.xit('spec 1', () => {
              env.expect(true).toBe(false)
            })
            env.describe('suite 2', () => {
              env.it('spec 2', () => {
                env.pending('Will work soon')
                env.expect(2).toBe(1)
              })
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains([
            /.*/,
            /Pending/,
            /.*/,
            '',
            '1) suite 1 spec 1',
            '  Temporarily disabled with xit',
            '',
            '2) suite 1 suite 2 spec 2',
            '  Will work soon',
            '',
          ])
          done()
        }
      )
    })

    it('should report pending with incomplete', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.xit('spec', () => {
              env.passed()
            })
            env.it('spec', () => {
              env.pending()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains('Executed 0 of 2 specs INCOMPLETE (2 PENDING) in {time}.')
          done()
        }
      )
    })

    it('should report pending with failure', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.xit('spec', () => {
              env.passed()
            })
            env.it('spec', () => {
              env.failed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).toContain('Executed 1 of 2 specs (1 FAILED) (1 PENDING) in {time}.')
          done()
        }
      )
    })

    it('should report skipped with incomplete', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
            env.fit('spec', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).toContain('Executed 1 of 2 specs INCOMPLETE (1 SKIPPED) in {time}.')
          done()
        }
      )
    })

    it('should report ERRORS when afterAll in suite throws', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
            env.afterAll(() => {
              throw new Error('afterAll threw')
            })
          })
        },
        (outputs, summary) => {
          expect(summary).toContain('Executed 1 of 1 spec (1 ERROR) in {time}.')
          done()
        }
      )
    })

    it('should report ERRORS when afterAll throws', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
            env.afterAll(() => {
              throw new Error('afterAll in suite threw')
            })
          })
          env.afterAll(() => {
            throw new Error('afterAll threw')
          })
        },
        (outputs, summary) => {
          expect(summary).toContain('Executed 1 of 1 spec (2 ERRORS) in {time}.')
          done()
        }
      )
    })

    it('should report skipped with failure and pending', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.fdescribe('suite', () => {
            env.xit('spec', () => {
              env.passed()
            })
            env.it('spec', () => {
              env.failed()
            })
          })
          env.describe('suite', () => {
            env.it('spec', () => {
              env.passed()
            })
            env.xit('spec', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).toContain('Executed 1 of 4 specs (1 FAILED) (1 PENDING) (2 SKIPPED) in {time}.')
          done()
        }
      )
    })

    it('should report seed', (done) => {
      JasmineEnv.execute(
        this.reporter,
        (env) => {
          env.describe('suite 1', () => {
            env.it('spec 1', () => {
              env.passed()
            })
          })
        },
        (outputs, summary) => {
          expect(summary).contains(/Randomized with seed \d+\./)
          done()
        },
        { random: true }
      )
    })
  })
})
