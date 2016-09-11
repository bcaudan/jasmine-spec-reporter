"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main_1 = require("../../built/main");
var TestProcessor = (function (_super) {
    __extends(TestProcessor, _super);
    function TestProcessor(options) {
        _super.call(this, options);
        this.options = options;
        this.test = options.test;
    }
    TestProcessor.prototype.displayJasmineStarted = function (runner, log) {
        return log + this.test;
    };
    TestProcessor.prototype.displaySuite = function (suite, log) {
        return log + this.test;
    };
    TestProcessor.prototype.displaySpecStarted = function (spec, log) {
        return spec.description + this.test;
    };
    TestProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
        return log + this.test;
    };
    TestProcessor.prototype.displayFailedSpec = function (spec, log) {
        return log + this.test;
    };
    TestProcessor.prototype.displayPendingSpec = function (spec, log) {
        return log + this.test;
    };
    return TestProcessor;
}(main_1.DisplayProcessor));
exports.TestProcessor = TestProcessor;
