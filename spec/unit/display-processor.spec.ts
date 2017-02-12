describe("spec reporter", () => {
    describe("with display processor", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                customProcessors: [global.DisplayProcessor],
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when jasmine started", () => {
            it("should report start", () => {
                expect(new Test(this.reporter, function() {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/Spec started/);
            });
        });

        describe("when suite", () => {
            it("should report suite", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/suite/);
            });
        });

        describe("when spec started", () => {
            it("should not report start", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("spec to be started", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains([
                    "  suite",
                    "    ✓ spec to be started"
                ]);
            });
        });

        describe("when spec done", () => {
            it("should report success", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/successful spec/);
            });

            it("should report failure", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs).contains([/failed spec/]);
            });

            it("should display spec error messages", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs).contains(["      - Expected true to be false."]);
            });

            it("should report pending", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/pending spec/);
            });
        });

        describe("when summary", () => {
            it("should display summary error messages", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).summary).contains(["  - Expected true to be false."]);
            });
        });
    });
});
