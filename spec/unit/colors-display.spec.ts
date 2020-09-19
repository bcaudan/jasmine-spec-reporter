describe("with colors", () => {
    describe("default", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when spec", () => {
            it("should report success", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.it("successful spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).not.contains("    ✓ successful spec");
                        expect(outputs).contains("    " + global.colors.green("✓ successful spec"));
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should report failure", done => {
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
                        expect(outputs).not.contains("    ✗ failed spec");
                        expect(outputs).contains("    " + global.colors.red("✗ failed spec"));
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should not report pending", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.xit("pending spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).not.contains("    * pending spec");
                        expect(outputs).contains("    " + global.colors.yellow("* pending spec"));
                        done();
                    },
                    { withColor: true }
                );
            });
        });
    });

    describe("custom", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                colors: {
                    failed: "white",
                    pending: "blue",
                    successful: "magenta",
                },
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when spec", () => {
            it("should report success", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.it("successful spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).contains("    " + global.colors.magenta("✓ successful spec"));
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should report failure", done => {
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
                        expect(outputs).contains("    " + global.colors.white("✗ failed spec"));
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should not report pending", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.xit("pending spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).contains("    " + global.colors.blue("* pending spec"));
                        done();
                    },
                    { withColor: true }
                );
            });
        });
    });

    describe("disabled", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                colors: {
                    enabled: false
                },
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when spec", () => {
            it("should report success", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.it("successful spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).contains("    ✓ successful spec");
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should report failure", done => {
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
                        expect(outputs).contains("    ✗ failed spec");
                        done();
                    },
                    { withColor: true }
                );
            });

            it("should not report pending", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.xit("pending spec", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).contains("    * pending spec");
                        done();
                    },
                    { withColor: true }
                );
            });
        });
    });
});
