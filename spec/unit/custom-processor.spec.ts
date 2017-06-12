describe("spec reporter", () => {
    describe("with custom processor", () => {
        beforeEach(() => {
            this.reporter = new global.SpecReporter({
                customOptions: {
                    test: " TEST"
                },
                customProcessors: [global.TestProcessor],
                spec: {
                    displayPending: true
                }
            });
        });

        describe("when jasmine started", () => {
            it("should report start with custom display", done => {
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
                        expect(outputs).contains(/Jasmine started TEST/);
                        done();
                    }
                );
            });
        });

        describe("when suite", () => {
            it("should report suite with custom display", done => {
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
                        expect(outputs).contains(/suite TEST/);
                        done();
                    }
                );
            });
        });

        describe("when spec started", () => {
            it("should report start", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.it("spec to be started", () => {
                                env.passed();
                            });
                        });
                    },
                    outputs => {
                        expect(outputs).contains([
                            "  suite TEST",
                            "    spec to be started TEST",
                            "    ✓ spec to be started TEST"
                        ]);
                        done();
                    }
                );
            });
        });

        describe("when spec done", () => {
            it("should report success with custom display", done => {
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
                        expect(outputs).contains(/successful spec TEST/);
                        done();
                    }
                );
            });

            it("should report failure with custom display", done => {
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
                        expect(outputs).contains([/failed spec TEST/]);
                        done();
                    }
                );
            });

            it("should display spec error messages with custom display", done => {
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
                        expect(outputs).contains(["      - Expected true to be false. TEST"]);
                        done();
                    }
                );
            });

            it("should report pending with custom display", done => {
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
                        expect(outputs).contains(/pending spec TEST/);
                        done();
                    }
                );
            });
        });

        describe("when summary", () => {
            it("should display summary error messages with custom display", done => {
                JasmineEnv.execute(
                    this.reporter,
                    env => {
                        env.describe("suite", () => {
                            env.it("failed spec", () => {
                                env.failed();
                            });
                        });
                    },
                    (outputs, summary) => {
                        expect(summary).contains(["  - Expected true to be false. TEST"]);
                        done();
                    }
                );
            });
        });
    });
});
