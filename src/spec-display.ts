export class SpecDisplay {
    private indent = '  ';
    private currentIndent = '';
    private suiteHierarchy = [];
    private suiteHierarchyDisplayed = [];
    private successfulSpecs = [];
    private failedSpecs = [];
    private pendingSpecs = [];
    private lastWasNewLine = false;
    private displaySuccessesSummary;
    private displayFailuresSummary;
    private displayPendingSummary;
    private displaySuccessfulSpec;
    private displayFailedSpec;
    private displayPendingSpec;
    private displayWithoutColors;
    private hasCustomDisplaySpecStarted;
    private displaySpecsWithStacktrace;
    private displaySummaryWithStacktrace;

    constructor(options, private displayProcessors) {
        this.displaySuccessesSummary = options.displaySuccessesSummary || false;
        this.displayFailuresSummary = options.displayFailuresSummary !== false;
        this.displayPendingSummary = options.displayPendingSummary !== false;
        this.displaySuccessfulSpec = options.displaySuccessfulSpec !== false;
        this.displayFailedSpec = options.displayFailedSpec !== false;
        this.displayPendingSpec = options.displayPendingSpec || false;
        this.displayWithoutColors = options.colors === false;
        this.hasCustomDisplaySpecStarted = options.hasCustomDisplaySpecStarted;

        var displayStacktrace = options.displayStacktrace || 'none';
        this.displaySpecsWithStacktrace = displayStacktrace === 'all' || displayStacktrace === 'specs';
        this.displaySummaryWithStacktrace = displayStacktrace === 'all' || displayStacktrace === 'summary';
    }

    jasmineStarted(runner) {
        var log = null;
        this.displayProcessors.forEach(function (displayProcessor) {
            log = displayProcessor.displayJasmineStarted(runner, log);
        });
        this.log(log);
    }

    summary(metrics) {
        var execution = 'Executed ' + metrics.executedSpecs + ' of ' + metrics.totalSpecsDefined + (metrics.totalSpecsDefined === 1 ? ' spec ' : ' specs ');
        var successful = (metrics.failedSpecs === 0) ? 'SUCCESS ' : '';
        var failed = (metrics.failedSpecs > 0) ? '(' + metrics.failedSpecs + ' FAILED) ' : '';
        var pending = (metrics.pendingSpecs > 0) ? '(' + metrics.pendingSpecs + ' PENDING) ' : '';
        var skipped = (metrics.skippedSpecs > 0) ? '(' + metrics.skippedSpecs + ' SKIPPED) ' : '';
        var duration = 'in ' + metrics.duration + '.';

        this.resetIndent();
        this.newLine();
        if (this.displaySuccessesSummary && metrics.successfulSpecs > 0) {
            this.successesSummary();
        }
        if (this.displayFailuresSummary && metrics.failedSpecs > 0) {
            this.failuresSummary();
        }
        if (this.displayPendingSummary && metrics.pendingSpecs > 0) {
            this.pendingsSummary();
        }
        this.log(execution + successful.success + failed.failure + pending.pending + skipped + duration);

        if (metrics.random) {
            this.log('Randomized with seed ' + metrics.seed + '.');
        }
    }

    successesSummary() {
        this.log("**************************************************");
        this.log("*                   Successes                    *");
        this.log("**************************************************");
        this.newLine();
        for (var i = 0; i < this.successfulSpecs.length; i++) {
            this.successfulSummary(this.successfulSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    successfulSummary(spec, index) {
        this.log(index + ') ' + spec.fullName);
    }

    failuresSummary() {
        this.log("**************************************************");
        this.log("*                    Failures                    *");
        this.log("**************************************************");
        this.newLine();
        for (var i = 0; i < this.failedSpecs.length; i++) {
            this.failedSummary(this.failedSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    failedSummary(spec, index) {
        this.log(index + ') ' + spec.fullName);
        this.displayErrorMessages(spec, this.displaySummaryWithStacktrace);
    }

    pendingsSummary() {
        this.log("**************************************************");
        this.log("*                    Pending                     *");
        this.log("**************************************************");
        this.newLine();
        for (var i = 0; i < this.pendingSpecs.length; i++) {
            this.pendingSummary(this.pendingSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    pendingSummary(spec, index) {
        this.log(index + ') ' + spec.fullName);
        this.increaseIndent();
        var pendingReason = spec.pendingReason ? spec.pendingReason : 'No reason given';
        this.log(pendingReason.pending);
        this.resetIndent();
    }

    specStarted(spec) {
        if (this.hasCustomDisplaySpecStarted) {
            this.ensureSuiteDisplayed();
            var log = null;
            this.displayProcessors.forEach(function (displayProcessor) {
                log = displayProcessor.displaySpecStarted(spec, log);
            });
            this.log(log);
        }
    }

    successful(spec) {
        this.successfulSpecs.push(spec);
        if (this.displaySuccessfulSpec) {
            this.ensureSuiteDisplayed();
            var log = null;
            this.displayProcessors.forEach(function (displayProcessor) {
                log = displayProcessor.displaySuccessfulSpec(spec, log);
            });
            this.log(log);
        }
    }

    failed(spec) {
        this.failedSpecs.push(spec);
        if (this.displayFailedSpec) {
            this.ensureSuiteDisplayed();
            var log = null;
            this.displayProcessors.forEach(function (displayProcessor) {
                log = displayProcessor.displayFailedSpec(spec, log);
            });
            this.log(log);
            this.displayErrorMessages(spec, this.displaySpecsWithStacktrace);
        }
    }

    pending(spec) {
        this.pendingSpecs.push(spec);
        if (this.displayPendingSpec) {
            this.ensureSuiteDisplayed();
            var log = null;
            this.displayProcessors.forEach(function (displayProcessor) {
                log = displayProcessor.displayPendingSpec(spec, log);
            });
            this.log(log);
        }
    }

    displayErrorMessages(spec, withStacktrace) {
        this.increaseIndent();
        for (var i = 0; i < spec.failedExpectations.length; i++) {
            this.log('- '.failure + spec.failedExpectations[i].message.failure);
            if (withStacktrace && spec.failedExpectations[i].stack) {
                this.log(this.filterStackTraces(spec.failedExpectations[i].stack));
            }
        }
        this.decreaseIndent();
    }

    filterStackTraces(traces) {
        var lines = traces.split('\n');
        var filtered = [];
        for (var i = 1; i < lines.length; i++) {
            if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
                filtered.push(lines[i]);
            }
        }
        return filtered.join('\n' + this.currentIndent);
    }

    suiteStarted(suite) {
        this.suiteHierarchy.push(suite);
    }

    suiteDone() {
        var suite = this.suiteHierarchy.pop();
        if (this.suiteHierarchyDisplayed[this.suiteHierarchyDisplayed.length - 1] === suite) {
            this.suiteHierarchyDisplayed.pop();
        }
        this.newLine();
        this.decreaseIndent();
    }

    ensureSuiteDisplayed() {
        if (this.suiteHierarchy.length !== 0) {
            for (var i = this.suiteHierarchyDisplayed.length; i < this.suiteHierarchy.length; i++) {
                this.suiteHierarchyDisplayed.push(this.suiteHierarchy[i]);
                this.displaySuite(this.suiteHierarchy[i]);
            }
        } else {
            var topLevelSuite = {description: 'Top level suite'};
            this.suiteHierarchy.push(topLevelSuite);
            this.suiteHierarchyDisplayed.push(topLevelSuite);
            this.displaySuite(topLevelSuite);
        }
    }

    displaySuite(suite) {
        this.newLine();
        this.computeSuiteIndent();
        var log = null;
        this.displayProcessors.forEach(function (displayProcessor) {
            log = displayProcessor.displaySuite(suite, log);
        });
        this.log(log);
        this.increaseIndent();
    }

    computeSuiteIndent() {
        this.resetIndent();
        for (var i = 0; i < this.suiteHierarchyDisplayed.length; i++) {
            this.increaseIndent();
        }
    }

    log(stuff) {
        if (stuff !== null) {
            if (this.displayWithoutColors) {
                stuff = stuff.stripColors;
            }
            console.log(this.currentIndent + stuff);
            this.lastWasNewLine = false;
        }
    }

    newLine() {
        if (!this.lastWasNewLine) {
            console.log('');
            this.lastWasNewLine = true;
        }
    }

    resetIndent() {
        this.currentIndent = '';
    }

    increaseIndent() {
        this.currentIndent += this.indent;
    }

    decreaseIndent() {
        this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
    }
}
