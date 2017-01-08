declare namespace NodeJS {
    export interface Global {
        SpecReporter;
        TestProcessor;
    }
}

global.SpecReporter = require("../../built/main").SpecReporter;
global.TestProcessor = require("./test-processor").TestProcessor;

beforeAll(() => {
    const addMatchers = require("./test-helper").addMatchers;
    addMatchers();
});
