describe("with suite number enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      suite: {
        displayNumber: true
      }
    });
  });

  describe("when single suite", () => {
    it("should add suite number", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("suite", () => {
            env.it("successful spec", () => {
              env.passed();
            });
          });
        },
        outputs => {
          expect(outputs).contains(/1 suite/);
          done();
        }
      );
    });
  });

  describe("when multiple suite", () => {
    it("should add suite number", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("first suite", () => {
            env.it("successful spec", () => {
              env.passed();
            });
          });
          env.describe("second suite", () => {
            env.it("successful spec", () => {
              env.passed();
            });
          });
          env.describe("third suite", () => {
            env.it("successful spec", () => {
              env.passed();
            });
          });
        },
        outputs => {
          expect(outputs).contains(/1 first suite/);
          expect(outputs).contains(/2 second suite/);
          expect(outputs).contains(/3 third suite/);
          done();
        }
      );
    });
  });

  describe("when multiple nested suite", () => {
    it("should add suite number", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("first suite", () => {
            env.describe("first child suite", () => {
              env.describe("first grandchild suite", () => {
                env.it("successful spec", () => {
                  env.passed();
                });
              });
              env.describe("second grandchild suite", () => {
                env.it("successful spec", () => {
                  env.passed();
                });
              });
            });
            env.describe("second child suite", () => {
              env.it("successful spec", () => {
                env.passed();
              });
            });
          });
        },
        outputs => {
          expect(outputs).contains(/1 first suite/);
          expect(outputs).contains(/1.1 first child suite/);
          expect(outputs).contains(/1.1.1 first grandchild suite/);
          expect(outputs).contains(/1.1.2 second grandchild suite/);
          expect(outputs).contains(/1.2 second child suite/);
          done();
        }
      );
    });
  });
});
