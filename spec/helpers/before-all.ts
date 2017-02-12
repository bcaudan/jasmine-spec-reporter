declare namespace NodeJS {
    export interface Global {
        SpecReporter;
        DisplayProcessor;
        TestProcessor;
    }
}

global.SpecReporter = require("../../built/main").SpecReporter;
global.DisplayProcessor = require("../../built/main").DisplayProcessor;
global.TestProcessor = require("./test-processor").TestProcessor;

beforeAll(() => {
    const addMatchers = require("./test-helper").addMatchers;
    addMatchers();
});
