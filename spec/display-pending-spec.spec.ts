describe("with pending spec enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayPending: true
            }
        });
    });

    describe("when spec", () => {
        it("should report pending", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.xit("pending spec", () => {
                        this.passed();
                    });
                });
            }).outputs).contains(/\* pending spec/);
        });
    });
});
