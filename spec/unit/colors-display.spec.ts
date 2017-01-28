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
            it("should report success", () => {
                const outputs = new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("successful spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs;
                expect(outputs).not.contains("    ✓ successful spec");
                expect(outputs).contains("    " + "✓ successful spec".green);
            });

            it("should report failure", () => {
                const outputs = new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("failed spec", () => {
                                this.failed();
                            });
                        });
                    },
                    true).outputs;
                expect(outputs).not.contains("    ✗ failed spec");
                expect(outputs).contains("    " + "✗ failed spec".red);
            });

            it("should not report pending", () => {
                const outputs = new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.xit("pending spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs;
                expect(outputs).not.contains("    * pending spec");
                expect(outputs).contains("    " + "* pending spec".yellow);
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
            it("should report success", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("successful spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs).contains("    " + "✓ successful spec".magenta);
            });

            it("should report failure", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("failed spec", () => {
                                this.failed();
                            });
                        });
                    },
                    true).outputs).contains("    " + "✗ failed spec".white);
            });

            it("should not report pending", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.xit("pending spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs).contains("    " + "* pending spec".blue);
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
            it("should report success", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("successful spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs).contains("    ✓ successful spec");
            });

            it("should report failure", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.it("failed spec", () => {
                                this.failed();
                            });
                        });
                    },
                    true).outputs).contains("    ✗ failed spec");
            });

            it("should not report pending", () => {
                expect(new Test(
                    this.reporter,
                    function() {
                        this.describe("suite", () => {
                            this.xit("pending spec", () => {
                                this.passed();
                            });
                        });
                    },
                    true).outputs).contains("    * pending spec");
            });
        });
    });
});
