describe("With spec display stacktrace enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayStacktrace: true
            }
        });
    });

    describe("when failed spec", () => {
        it("should display with error messages with stacktraces", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/passed assertion/);
            expect(outputs).contains([
                "    ✗ failed spec",
                "      - Expected true to be false.",
                /at Env\.env\.failed/, /at Object\.<anonymous>/,
                ""
            ]);
        });
    });

    describe("when summary", () => {
        it("should not report stacktraces in failures summary", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.expect(true).toBe(false);
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.expect(2).toBe(1);
                        });
                    });
                });
            }).summary).contains([
                /.*/,
                /Failures/,
                /.*/,
                "",
                "1) suite 1 spec 1",
                "  - Expected true to be false.",
                "", "2) suite 1 suite 2 spec 2",
                "  - Expected 2 to be 1.",
                ""
            ]);
        });
    });
});

describe("With summary display stacktrace enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayStacktrace: true
            }
        });
    });

    describe("when failed spec", () => {
        it("should not display stacktraces with error messages", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/passed assertion/);
            expect(outputs).contains([ "    ✗ failed spec", "      - Expected true to be false.", "" ]);
        });
    });

    describe("when summary", () => {
        it("should report failures summary with stacktraces", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.expect(true).toBe(false);
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.expect(2).toBe(1);
                        });
                    });
                });
            }).summary).contains([
                /.*/,
                /Failures/,
                /.*/,
                "",
                "1) suite 1 spec 1",
                "  - Expected true to be false.",
                /at Object\.<anonymous>/,
                "",
                "2) suite 1 suite 2 spec 2",
                "  - Expected 2 to be 1.",
                /at Object\.<anonymous>/,
                ""
            ]);
        });
    });
});

describe("With custom stacktrace filter function", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayStacktrace: true
            },
            stacktrace: {
                filter: stacktrace => {
                    return "Updated stacktrace";
                }
            },
            summary: {
                displayStacktrace: true
            },
        });
    });

    describe("when failed spec", () => {
        it("should filter stacktraces", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/at Object\.<anonymous>/);
            expect(outputs).contains(/Updated stacktrace/);
        });
    });

    describe("when summary", () => {
        it("should filter stacktraces", () => {
            const summary = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.expect(true).toBe(false);
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.expect(2).toBe(1);
                        });
                    });
                });
            }).summary;
            expect(summary).not.contains(/at Object\.<anonymous>/);
            expect(summary).contains(/Updated stacktrace/);
        });
    });
});
