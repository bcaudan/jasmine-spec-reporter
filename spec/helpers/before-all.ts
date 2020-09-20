declare namespace NodeJS {
    export interface Global {
        SpecReporter;
        DisplayProcessor;
        TestProcessor;
        colors;
    }
}

global.SpecReporter = require("../../built/main").SpecReporter;
global.DisplayProcessor = require("../../built/main").DisplayProcessor;
global.TestProcessor = require("./test-processor").TestProcessor;
// tslint:disable-next-line:no-submodule-imports
global.colors = require("colors/safe");

beforeAll(() => {
    const addMatchers = require("./test-helper").addMatchers;
    addMatchers();
});
