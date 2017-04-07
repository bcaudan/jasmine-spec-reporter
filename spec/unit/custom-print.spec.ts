describe("spec reporter", () => {

    let outputs: string[];

    describe("with custom print", () => {
        beforeEach(() => {
            outputs = [];
            this.reporter = new global.SpecReporter({
                colors: {
                    enabled: false,
                    },
                print: line => {
                    outputs.push(line);
                },
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when jasmine started", () => {
            it("should report start with ", () => {
                expect(new Test(this.reporter, function() {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains(/Spec started/);
            });
        });

        describe("when suite", () => {
            it("should report suite with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains(/suite/);
            });
        });

        describe("when spec started", () => {
            it("should report start", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("spec to be started", () => {
                            this.passed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains([
                    "  suite",
                    "    " + "✓ spec to be started".green
                ]);
            });
        });

        describe("when spec done", () => {
            it("should report success with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains(/successful spec/);
            });

            it("should report failure with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains([/failed spec/]);
            });

            it("should display spec error messages with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains(["      - Expected true to be false."]);
            });

            it("should report pending with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs.length).toEqual(0);
                expect(outputs).contains(/pending spec/);
            });
        });

        describe("when summary", () => {
            it("should display summary error messages with custom print", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).summary.length).toEqual(0);
                expect(outputs).contains(["  - Expected true to be false."]);
            });
        });
    });
});
