describe("with suite number enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            suite: {
                displayNumber: true
            }
        });
    });

    describe("when single suite", () => {
        it("should add suite number", () => {
            expect(new Test(this.reporter, function () {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs).contains(/1 suite/);
        });
    });

    describe("when multiple suite", () => {
        it("should add suite number", () => {
            const outputs = new Test(this.reporter, function () {
                this.describe("first suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
                this.describe("second suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
                this.describe("third suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains(/1 first suite/);
            expect(outputs).contains(/2 second suite/);
            expect(outputs).contains(/3 third suite/);
        });
    });

    describe("when multiple nested suite", () => {
        it("should add suite number", () => {
            const outputs = new Test(this.reporter, function () {
                this.describe("first suite", () => {
                    this.describe("first child suite", () => {
                        this.describe("first grandchild suite", () => {
                            this.it("successful spec", () => {
                                this.passed();
                            });
                        });
                        this.describe("second grandchild suite", () => {
                            this.it("successful spec", () => {
                                this.passed();
                            });
                        });
                    });
                    this.describe("second child suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                });
            }).outputs;
            expect(outputs).contains(/1 first suite/);
            expect(outputs).contains(/1.1 first child suite/);
            expect(outputs).contains(/1.1.1 first grandchild suite/);
            expect(outputs).contains(/1.1.2 second grandchild suite/);
            expect(outputs).contains(/1.2 second child suite/);
        });
    });
});
