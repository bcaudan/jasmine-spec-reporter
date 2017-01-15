describe("with spec duration enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayDuration: true
            }
        });
    });

    describe("when spec", () => {
        it("should report success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs).contains(/✓ successful spec \({time}\)/);
        });

        it("should report failure", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs).contains(/✗ failed spec \({time}\)/);
        });
    });
});

describe("with summary duration disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayDuration: false
            }
        });
    });

    describe("when summary", () => {
        it("should not display execution duration", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).summary).contains("Executed 1 of 1 spec SUCCESS.");
        });
    });
});
