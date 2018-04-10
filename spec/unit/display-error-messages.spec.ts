describe("with spec error messages disabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayErrorMessages: false
      }
    });
  });

  it("should not display error messages", done => {
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
        expect(outputs).not.contains(/Expected true to be false/);
        done();
      }
    );
  });
});

describe("with summary error messages disabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      summary: {
        displayErrorMessages: false
      }
    });
  });

  it("should not display error messages", done => {
    JasmineEnv.execute(
      this.reporter,
      env => {
        env.describe("suite", () => {
          env.it("failed spec", () => {
            env.failed();
          });
        });
      },
      (outputs, summary) => {
        expect(summary).not.contains(/Expected true to be false/);
        done();
      }
    );
  });
});
