require('../src/jasmine-spec-reporter.js');
jasmine.getEnv().reporter.subReporters_ = []; // remove jasmine-node default reporter
jasmine.getEnv().addReporter(new jasmine.SpecReporter());

describe('first suite', function () {
  it('should be ok', function () {
    expect(true).toBe(true);
  });

  it('should be ok', function () {
    expect(true).toBe(true);
  });

  it('should failed', function () {
    expect(true).toBe(false);
  });

  it('should be ok', function () {
    expect(true).toBe(true);
  });
});

describe('second suite', function () {
  it('should be ok', function () {
    expect(true).toBe(true);
  });

  it('should failed', function () {
    expect(true).toBe(false);
  });

  describe('first child suite', function () {
    describe('first grandchild suite', function () {
      it('should failed', function () {
        expect(true).toBe(false);
        expect(true).toBe(false);
        expect(true).toBe(true);
      });

      it('should failed', function () {
        expect(true).toBe(false);
      });
    });
  });

  describe('second child suite', function () {
    it('should be ok', function () {
      expect(true).toBe(true);
    });

    it('should be ok', function () {
      expect(true).toBe(true);
    });
  });
});
