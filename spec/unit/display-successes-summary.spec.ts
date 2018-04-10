describe("with successes summary enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displaySuccessful: true
      }
    });
  });

  describe("when summary", () => {
    it("should report successes summary", done => {
      JasmineEnv.execute(
        this.reporter,
        env => {
          env.describe("suite 1", () => {
            env.it("spec 1", () => {
              env.passed();
            });
          });
        },
        (outputs, summary) => {
          expect(summary).contains(/Successes/);
          done();
        }
      );
    });
  });
});
