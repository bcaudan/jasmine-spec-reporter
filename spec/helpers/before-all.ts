global.SpecReporter = require("../../built/main").SpecReporter;
global.TestProcessor = require("./test-processor").TestProcessor;

beforeAll(() => {
    let addMatchers = require("./test-helper.coffee").addMatchers;
    addMatchers();
});
