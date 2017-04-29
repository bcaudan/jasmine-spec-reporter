describe("with failures summary disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayFailed: false
            }
        });
    });

    describe("when summary", () => {
        it("should not report failures summary", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite 1", () => {
                        env.it("spec 1", () => {
                            env.failed();
                        });
                        env.describe("suite 2", () => {
                            env.it("spec 2", () => {
                                env.failed();
                            });
                        });
                    });
                },
                (outputs, summary) => {
                    expect(summary).not.contains(/Failures/);
                    done();
                }
            );
        });
    });
});
