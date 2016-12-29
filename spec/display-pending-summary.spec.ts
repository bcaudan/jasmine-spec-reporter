describe("with pending summary disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayPending: false
            }
        });
    });

    describe("when summary", () => {
        it("should not report pending summary", () => {
            expect(new Test(this.reporter, function () {
                this.describe("suite 1", () => {
                    this.xit("spec 1", () => {
                        this.failed();
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.pending();
                        });
                    });
                });
            }).summary).not.contains(/Pending/);
        });
    });
});
