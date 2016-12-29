describe("with successful spec disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displaySuccessful: false
            }
        });
    });

    describe("when spec", () => {
        it("should not report success", () => {
            expect(new Test(this.reporter, function () {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs).not.contains(/successful spec/);
        });
    });

    describe("when suite", () => {
        it("should not display fully successful suite", () => {
            const outputs = new Test(this.reporter, function () {
                this.describe("suite", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/suite/);
        });

        it("should display failed suite", () => {
            const outputs = new Test(this.reporter, function () {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains(/suite/);
            expect(outputs).contains(/failed spec/);
            expect(outputs).not.contains(/successful spec/);
        });
    });
});
