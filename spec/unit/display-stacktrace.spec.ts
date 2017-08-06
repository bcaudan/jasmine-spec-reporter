describe("With spec display stacktrace enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayStacktrace: true
            }
        });
    });

    describe("when failed spec", () => {
        it("should display with error messages with stacktraces", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite", () => {
                        env.it("failed spec", () => {
                            env.failed();
                        });
                    });
                },
                outputs => {
                    expect(outputs).not.contains(/passed assertion/);
                    expect(outputs).contains([
                        "    ✗ failed spec",
                        "      - Expected true to be false.",
                        /at Env\.env\.failed/, /at UserContext\.<anonymous>/,
                        ""
                    ]);
                    done();
                }
            );
        });
    });

    describe("when summary", () => {
        it("should not report stacktraces in failures summary", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite 1", () => {
                        env.it("spec 1", () => {
                            env.expect(true).toBe(false);
                        });
                        env.describe("suite 2", () => {
                            env.it("spec 2", () => {
                                env.expect(2).toBe(1);
                            });
                        });
                    });
                },
                (outputs, summary) => {
                    expect(summary).contains([
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
                    done();
                }
            );
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
        it("should not display stacktraces with error messages", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite", () => {
                        env.it("failed spec", () => {
                            env.failed();
                        });
                    });
                },
                outputs => {
                    expect(outputs).not.contains(/passed assertion/);
                    expect(outputs).contains([ "    ✗ failed spec", "      - Expected true to be false.", "" ]);
                    done();
                }
            );
        });
    });

    describe("when summary", () => {
        it("should report failures summary with stacktraces", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite 1", () => {
                        env.it("spec 1", () => {
                            env.expect(true).toBe(false);
                        });
                        env.describe("suite 2", () => {
                            env.it("spec 2", () => {
                                env.expect(2).toBe(1);
                            });
                        });
                    });
                },
                (outputs, summary) => {
                    expect(summary).contains([
                        /.*/,
                        /Failures/,
                        /.*/,
                        "",
                        "1) suite 1 spec 1",
                        "  - Expected true to be false.",
                        /at UserContext\.<anonymous>/,
                        "",
                        "2) suite 1 suite 2 spec 2",
                        "  - Expected 2 to be 1.",
                        /at UserContext\.<anonymous>/,
                        ""
                    ]);
                    done();
                }
            );
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
        it("should filter stacktraces", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite", () => {
                        env.it("failed spec", () => {
                            env.failed();
                        });
                    });
                },
                outputs => {
                    expect(outputs).not.contains(/at Object\.<anonymous>/);
                    expect(outputs).contains(/Updated stacktrace/);
                    done();
                }
            );
        });
    });

    describe("when summary", () => {
        it("should filter stacktraces", done => {
            JasmineEnv.execute(
                this.reporter,
                env => {
                    env.describe("suite 1", () => {
                        env.it("spec 1", () => {
                            env.expect(true).toBe(false);
                        });
                        env.describe("suite 2", () => {
                            env.it("spec 2", () => {
                                env.expect(2).toBe(1);
                            });
                        });
                    });
                },
                (outputs, summary) => {
                    expect(summary).not.contains(/at Object\.<anonymous>/);
                    expect(summary).contains(/Updated stacktrace/);
                    done();
                }
            );
        });
    });
});
