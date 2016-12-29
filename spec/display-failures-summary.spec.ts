describe("with failures summary disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayFailed: false
            }
        });
    });

    describe("when summary", () => {
        it("should not report failures summary", () => {
            expect(new Test(this.reporter, function () {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.failed();
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.failed();
                        });
                    });
                });
            }).summary).not.contains(/Failures/);
        });
    });
});
