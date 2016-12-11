describe("with spec result prefixes", () => {
    describe("set to empty strings", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                displayPendingSpec: true,
                prefixes: {
                    success: "",
                    failure: "",
                    pending: ""
                }
            });
        });

        describe("when spec", () => {
            it("should report success", () => {
                expect(new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).not.contains(/✓/);
            });

            it("should report failure", () => {
                expect(new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs).not.contains(/✗/);
            });

            it("should report pending", () => {
                expect(new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).not.contains(/\*/);
            });
        });
    });

    describe("set to valid strings", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                displayPendingSpec: true,
                prefixes: {
                    success: "Pass ",
                    failure: "Fail ",
                    pending: "Pend "
                }
            });
        });

        describe("when spec", () => {
            it("should report success", () => {
                const outputs = new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs;
                expect(outputs).not.contains(/✓/);
                expect(outputs).contains(/Pass /);
            });

            it("should report failure", () => {
                const outputs = new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs;
                expect(outputs).not.contains(/✗/);
                expect(outputs).contains(/Fail /);
            });

            it("should report pending", () => {
                const outputs = new Test(this.reporter, function () {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs;
                expect(outputs).not.contains(/\*/);
                expect(outputs).contains(/Pend /);
            });
        });
    });
});
