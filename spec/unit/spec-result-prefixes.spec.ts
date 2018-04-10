describe("with spec result prefixes", () => {
  describe("set to empty strings", () => {
    beforeEach(() => {
      this.reporter = new global.SpecReporter({
        prefixes: {
          failed: "",
          pending: "",
          successful: ""
        },
        spec: {
          displayPending: true
        }
      });
    });

    describe("when spec", () => {
      it("should report success", done => {
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
            expect(outputs).not.contains(/✓/);
            done();
          }
        );
      });

      it("should report failure", done => {
        JasmineEnv.execute(
          this.reporter,
          env => {
            env.describe("suite", () => {
              env.it("failed spec", () => {
                env.failed();
              });
            });
          },
          outputs => {
            expect(outputs).not.contains(/✗/);
            done();
          }
        );
      });

      it("should report pending", done => {
        JasmineEnv.execute(
          this.reporter,
          env => {
            env.describe("suite", () => {
              env.xit("pending spec", () => {
                env.passed();
              });
            });
          },
          outputs => {
            expect(outputs).not.contains(/\*/);
            done();
          }
        );
      });
    });
  });

  describe("set to valid strings", () => {
    beforeEach(() => {
      this.reporter = new global.SpecReporter({
        prefixes: {
          failed: "Fail ",
          pending: "Pend ",
          successful: "Pass "
        },
        spec: {
          displayPending: true
        }
      });
    });

    describe("when spec", () => {
      it("should report success", done => {
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
            expect(outputs).not.contains(/✓/);
            expect(outputs).contains(/Pass /);
            done();
          }
        );
      });

      it("should report failure", done => {
        JasmineEnv.execute(
          this.reporter,
          env => {
            env.describe("suite", () => {
              env.it("failed spec", () => {
                env.failed();
              });
            });
          },
          outputs => {
            expect(outputs).not.contains(/✗/);
            expect(outputs).contains(/Fail /);
            done();
          }
        );
      });

      it("should report pending", done => {
        JasmineEnv.execute(
          this.reporter,
          env => {
            env.describe("suite", () => {
              env.xit("pending spec", () => {
                env.passed();
              });
            });
          },
          outputs => {
            expect(outputs).not.contains(/\*/);
            expect(outputs).contains(/Pend /);
            done();
          }
        );
      });
    });
  });
});
