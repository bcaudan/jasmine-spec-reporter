describe("with spec error messages disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayErrorMessages: false
            }
        });
    });

    it("should not display error messages", () => {
        expect(new Test(this.reporter, function() {
            this.describe("suite", () => {
                this.it("failed spec", () => {
                    this.failed();
                });
            });
        }).outputs).not.contains(/Expected true to be false/);
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

    it("should not display error messages", () => {
        expect(new Test(this.reporter, function() {
            this.describe("suite", () => {
                this.it("failed spec", () => {
                    this.failed();
                });
            });
        }).summary).not.contains(/Expected true to be false/);
    });
});
