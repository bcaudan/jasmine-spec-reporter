describe("with successful spec disabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displaySuccessful: false
      }
    });
  });

  describe("when spec", () => {
    it("should not report success", done => {
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
          expect(outputs).not.contains(/successful spec/);
          done();
        }
      );
    });
  });

  describe("when suite", () => {
    it("should not display fully successful suite", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("suite", () => {
            env.it("spec 1", () => {
              env.passed();
            });
            env.it("spec 2", () => {
              env.passed();
            });
          });
        },
        outputs => {
          expect(outputs).not.contains(/suite/);
          done();
        }
      );
    });

    it("should display failed suite", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("suite", () => {
            env.it("failed spec", () => {
              env.failed();
            });
            env.it("successful spec", () => {
              env.passed();
            });
          });
        },
        outputs => {
          expect(outputs).contains(/suite/);
          expect(outputs).contains(/failed spec/);
          expect(outputs).not.contains(/successful spec/);
          done();
        }
      );
    });
  });
});
