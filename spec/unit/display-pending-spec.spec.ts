describe("with pending spec enabled", () => {
  beforeEach(() => {
    this.reporter = new global.SpecReporter({
      spec: {
        displayPending: true
      }
    });
  });

  describe("when spec", () => {
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
          expect(outputs).contains(/\* pending spec/);
          done();
        }
      );
    });
  });
});
