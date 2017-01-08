describe("with successes summary enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displaySuccessful: true
            }
        });
    });

    describe("when summary", () => {
        it("should report successes summary", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                });
            }).summary).contains(/Successes/);
        });
    });
});
