describe("spec reporter", () => {
    describe("with custom processor", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                spec: {
                    displayPending: true
                },
                customProcessors: [global.TestProcessor],
                customOptions: {
                    test: " TEST"
                }
            });
        });

        describe("when jasmine started", () => {
            it("should report start with custom display", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/Spec started TEST/);
            });
        });

        describe("when suite", () => {
            it("should report suite with custom display", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/suite TEST/);
            });
        });

        describe("when spec started", () => {
            it("should report start", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.it("spec to be started", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains([ "  suite TEST", "    spec to be started TEST", "    ✓ spec to be started TEST" ]);
            });
        });

        describe("when spec done", () => {
            it("should report success with custom display", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/successful spec TEST/);
            });

            it("should report failure with custom display", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs).contains(/failed spec TEST/);
            });

            it("should report pending with custom display", () => {
                expect(new Test(this.reporter, function ()  {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/pending spec TEST/);
            });
        });
    });
});
