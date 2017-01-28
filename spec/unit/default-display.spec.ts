describe("with default display", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter();
    });

    describe("when jasmine started", () => {
        it("should report start", () => {
            expect(new Test(this.reporter, function() {
                this.it("successful spec", () => {
                    this.passed();
                });
            }).outputs).contains(/Spec started/);
        });
    });

    describe("when spec", () => {
        it("should report success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs).contains(/✓ successful spec/);
        });

        it("should report failure", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs).contains(/✗ failed spec/);
        });

        it("should not report pending", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.xit("pending spec", () => {
                        this.passed();
                    });
                });
            }).outputs).not.contains(/pending spec/);
        });
    });

    describe("when failed spec", () => {
        it("should display with error messages", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.expect(true).toBe(false);
                        this.passed();
                        this.expect(2).toBe(1);
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/passed assertion/);
            expect(outputs).contains([
                "    ✗ failed spec",
                "      - Expected true to be false.",
                "      - Expected 2 to be 1.",
                ""
            ]);
        });
    });

    describe("when suite", () => {
        it("should display top level suite", () => {
            expect(new Test(this.reporter, function() {
                this.it("spec 1", () => {
                    this.passed();
                });
                this.it("spec 2", () => {
                    this.passed();
                });
            }).outputs).contains([ "  Top level suite", "    ✓ spec 1", "    ✓ spec 2", "" ]);
        });

        it("should display multiple specs", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs).contains([ "", "  suite", "    ✓ spec 1", "    ✓ spec 2", "" ]);
        });

        it("should display multiple suites", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                });
                this.describe("suite 2", () => {
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs).contains([ "", "  suite 1", "    ✓ spec 1", "", "  suite 2", "    ✓ spec 2", "" ]);
        });

        it("should display nested suite at first position", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.describe("suite 2", () => {
                        this.it("spec 1", () => {
                            this.passed();
                        });
                    });
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs).contains([ "", "  suite 1", "", "    suite 2", "      ✓ spec 1", "", "    ✓ spec 2", "" ]);
        });

        it("should display nested suite at last position", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.passed();
                        });
                    });
                });
            }).outputs).contains([ "", "  suite 1", "    ✓ spec 1", "", "    suite 2", "      ✓ spec 2", "" ]);
        });

        it("should display multiple nested suites", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.passed();
                        });
                    });
                    this.describe("suite 3", () => {
                        this.it("spec 3", () => {
                            this.passed();
                        });
                    });
                });
            }).outputs).contains([
                "",
                "  suite 1",
                "",
                "    suite 2",
                "      ✓ spec 2",
                "",
                "    suite 3",
                "      ✓ spec 3",
                ""
            ]);
        });

        it("should not display empty suite", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                });
                // tslint:disable-next-line:no-empty
                this.describe("empty suite", () => {
                });
            }).outputs;
            expect(outputs).contains([ "  suite 1", "    ✓ spec 1", "" ]);
            expect(outputs).not.contains(/empty suite/);
        });
    });

    describe("summary", () => {
        it("should report success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec", () => {
                        this.passed();
                    });
                });
            }).summary).contains("Executed 1 of 1 spec SUCCESS in {time}.");
        });

        it("should not report successes summary", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec", () => {
                        this.passed();
                    });
                });
            }).summary).not.contains(/Successes/);
        });

        it("should report failure", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec", () => {
                        this.failed();
                    });
                });
            }).summary).contains("Executed 1 of 1 spec (1 FAILED) in {time}.");
        });

        it("should report failures summary", () => {
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
                "",
                "2) suite 1 suite 2 spec 2",
                "  - Expected 2 to be 1.",
                ""
            ]);
        });

        it("should report failures summary", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.xit("spec 1", () => {
                        this.expect(true).toBe(false);
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.pending("Will work soon");
                            this.expect(2).toBe(1);
                        });
                    });
                });
            }).summary).contains([
                /.*/,
                /Pending/,
                /.*/,
                "",
                "1) suite 1 spec 1",
                "  Temporarily disabled with xit",
                "",
                "2) suite 1 suite 2 spec 2",
                "  Will work soon",
                ""
            ]);
        });

        it("should report pending with success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.xit("spec", () => {
                        this.passed();
                    });
                    this.it("spec", () => {
                        this.pending();
                    });
                });
            }).summary).contains("Executed 0 of 2 specs SUCCESS (2 PENDING) in {time}.");
        });

        it("should report pending with failure", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.xit("spec", () => {
                        this.passed();
                    });
                    this.it("spec", () => {
                        this.failed();
                    });
                });
            }).summary).toContain("Executed 1 of 2 specs (1 FAILED) (1 PENDING) in {time}.");
        });

        it("should report skipped with success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec", () => {
                        this.passed();
                    });
                    this.fit("spec", () => {
                        this.passed();
                    });
                });
            }).summary).toContain("Executed 1 of 2 specs SUCCESS (1 SKIPPED) in {time}.");
        });

        it("should report skipped with failure and pending", () => {
            expect(new Test(this.reporter, function() {
                this.fdescribe("suite", () => {
                    this.xit("spec", () => {
                        this.passed();
                    });
                    this.it("spec", () => {
                        this.failed();
                    });
                });
                this.describe("suite", () => {
                    this.it("spec", () => {
                        this.passed();
                    });
                    this.xit("spec", () => {
                        this.passed();
                    });
                });
            }).summary).toContain("Executed 1 of 4 specs (1 FAILED) (1 PENDING) (2 SKIPPED) in {time}.");
        });

        it("should report seed", () => {
            expect(new Test(
                this.reporter,
                function() {
                    this.describe("suite 1", () => {
                        this.it("spec 1", () => {
                            this.passed();
                        });
                    });
                },
                false,
                { random: true }
            ).summary).contains(/Randomized with seed \d+\./);
        });
    });
});
