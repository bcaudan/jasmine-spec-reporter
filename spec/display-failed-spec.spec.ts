describe("with failed spec disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            displayFailedSpec: false
        });
    });

    describe("when spec", () => {
        it("should not report failed", () => {
            expect(new Test(this.reporter, function () {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs).not.contains(/failed spec/);
        });
    });

    describe("when suite", () => {
        it("should not display fully failed suite", () => {
            expect(new Test(this.reporter, function () {
                this.describe("failed suite", () => {
                    this.it("spec 1", () => {
                        this.failed();
                    });
                    this.it("spec 2", () => {
                        this.failed();
                    });
                });
            }).outputs).not.contains(/failed suite/);
        });

        it("should display not fully failed suite", () => {
            const outputs = new Test(this.reporter, function () {
                this.describe("failed suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).contains(/failed suite/);
            expect(outputs).contains(/successful spec/);
            expect(outputs).not.contains(/failed spec/);
        });
    });
});
