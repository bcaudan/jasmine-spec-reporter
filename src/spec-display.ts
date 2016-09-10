import { DisplayProcessor } from "./display-processor";
import { SpecMetrics } from "./spec-metrics";

export class SpecDisplay {
    private indent: string = "  ";
    private currentIndent: string = "";
    private suiteHierarchy: any[] = [];
    private suiteHierarchyDisplayed: any[] = [];
    private successfulSpecs: any[] = [];
    private failedSpecs: any[] = [];
    private pendingSpecs: any[] = [];
    private lastWasNewLine: boolean = false;
    private displaySuccessesSummary: boolean;
    private displayFailuresSummary: boolean;
    private displayPendingSummary: boolean;
    private displaySuccessfulSpec: boolean;
    private displayFailedSpec: boolean;
    private displayPendingSpec: boolean;
    private displayWithoutColors: boolean;
    private hasCustomDisplaySpecStarted: boolean;
    private displaySpecsWithStacktrace: boolean;
    private displaySummaryWithStacktrace: boolean;

    constructor(options: any, private displayProcessors: DisplayProcessor[]) {
        this.displaySuccessesSummary = options.displaySuccessesSummary || false;
        this.displayFailuresSummary = options.displayFailuresSummary !== false;
        this.displayPendingSummary = options.displayPendingSummary !== false;
        this.displaySuccessfulSpec = options.displaySuccessfulSpec !== false;
        this.displayFailedSpec = options.displayFailedSpec !== false;
        this.displayPendingSpec = options.displayPendingSpec || false;
        this.displayWithoutColors = options.colors === false;
        this.hasCustomDisplaySpecStarted = options.hasCustomDisplaySpecStarted;

        let displayStacktrace: string = options.displayStacktrace || "none";
        this.displaySpecsWithStacktrace = displayStacktrace === "all" || displayStacktrace === "specs";
        this.displaySummaryWithStacktrace = displayStacktrace === "all" || displayStacktrace === "summary";
    }

    jasmineStarted(runner: any): void {
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
            log = displayProcessor.displayJasmineStarted(runner, log);
        });
        this.log(log);
    }

    summary(metrics: SpecMetrics): void {
        let execution: string = `Executed ${metrics.executedSpecs} of ${metrics.totalSpecsDefined}${(metrics.totalSpecsDefined === 1 ? " spec " : " specs ")}`;
        let successful: string = (metrics.failedSpecs === 0) ? "SUCCESS " : "";
        let failed: string = (metrics.failedSpecs > 0) ? `(${metrics.failedSpecs} FAILED) ` : "";
        let pending: string = (metrics.pendingSpecs > 0) ? `(${metrics.pendingSpecs} PENDING) ` : "";
        let skipped: string = (metrics.skippedSpecs > 0) ? `(${metrics.skippedSpecs} SKIPPED) ` : "";
        let duration: string = `in ${metrics.duration}.`;

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
            this.log(`Randomized with seed ${metrics.seed}.`);
        }
    }

    successesSummary(): void {
        this.log("**************************************************");
        this.log("*                   Successes                    *");
        this.log("**************************************************");
        this.newLine();
        for (let i: number = 0; i < this.successfulSpecs.length; i++) {
            this.successfulSummary(this.successfulSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    successfulSummary(spec: any, index: number): void {
        this.log(`${index}) ${spec.fullName}`);
    }

    failuresSummary(): void {
        this.log("**************************************************");
        this.log("*                    Failures                    *");
        this.log("**************************************************");
        this.newLine();
        for (let i: number = 0; i < this.failedSpecs.length; i++) {
            this.failedSummary(this.failedSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    failedSummary(spec: any, index: number): void {
        this.log(`${index}) ${spec.fullName}`);
        this.displayErrorMessages(spec, this.displaySummaryWithStacktrace);
    }

    pendingsSummary(): void {
        this.log("**************************************************");
        this.log("*                    Pending                     *");
        this.log("**************************************************");
        this.newLine();
        for (let i: number = 0; i < this.pendingSpecs.length; i++) {
            this.pendingSummary(this.pendingSpecs[i], i + 1);
            this.newLine();
        }
        this.newLine();
        this.resetIndent();
    }

    pendingSummary(spec: any, index: number) {
        this.log(`${index}) ${spec.fullName}`);
        this.increaseIndent();
        let pendingReason = spec.pendingReason ? spec.pendingReason : "No reason given";
        this.log(pendingReason.pending);
        this.resetIndent();
    }

    specStarted(spec: any): void {
        if (this.hasCustomDisplaySpecStarted) {
            this.ensureSuiteDisplayed();
            let log: String = "";
            this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
                log = displayProcessor.displaySpecStarted(spec, log);
            });
            this.log(log);
        }
    }

    successful(spec: any): void {
        this.successfulSpecs.push(spec);
        if (this.displaySuccessfulSpec) {
            this.ensureSuiteDisplayed();
            let log: String = "";
            this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
                log = displayProcessor.displaySuccessfulSpec(spec, log);
            });
            this.log(log);
        }
    }

    failed(spec: any): void {
        this.failedSpecs.push(spec);
        if (this.displayFailedSpec) {
            this.ensureSuiteDisplayed();
            let log: String = "";
            this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
                log = displayProcessor.displayFailedSpec(spec, log);
            });
            this.log(log);
            this.displayErrorMessages(spec, this.displaySpecsWithStacktrace);
        }
    }

    pending(spec: any): void {
        this.pendingSpecs.push(spec);
        if (this.displayPendingSpec) {
            this.ensureSuiteDisplayed();
            let log: String = "";
            this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
                log = displayProcessor.displayPendingSpec(spec, log);
            });
            this.log(log);
        }
    }

    displayErrorMessages(spec: any, withStacktrace: boolean): void {
        this.increaseIndent();
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
            this.log("- ".failure + spec.failedExpectations[i].message.failure);
            if (withStacktrace && spec.failedExpectations[i].stack) {
                this.log(this.filterStackTraces(spec.failedExpectations[i].stack));
            }
        }
        this.decreaseIndent();
    }

    filterStackTraces(traces: string): string {
        let lines: string[] = traces.split("\n");
        let filtered: string[] = [];
        for (let i: number = 1; i < lines.length; i++) {
            if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
                filtered.push(lines[i]);
            }
        }
        return filtered.join(`\n${this.currentIndent}`);
    }

    suiteStarted(suite: any): void {
        this.suiteHierarchy.push(suite);
    }

    suiteDone(): void {
        let suite = this.suiteHierarchy.pop();
        if (this.suiteHierarchyDisplayed[this.suiteHierarchyDisplayed.length - 1] === suite) {
            this.suiteHierarchyDisplayed.pop();
        }
        this.newLine();
        this.decreaseIndent();
    }

    ensureSuiteDisplayed(): void {
        if (this.suiteHierarchy.length !== 0) {
            for (let i: number = this.suiteHierarchyDisplayed.length; i < this.suiteHierarchy.length; i++) {
                this.suiteHierarchyDisplayed.push(this.suiteHierarchy[i]);
                this.displaySuite(this.suiteHierarchy[i]);
            }
        } else {
            let topLevelSuite: any = { description: "Top level suite" };
            this.suiteHierarchy.push(topLevelSuite);
            this.suiteHierarchyDisplayed.push(topLevelSuite);
            this.displaySuite(topLevelSuite);
        }
    }

    displaySuite(suite: any): void {
        this.newLine();
        this.computeSuiteIndent();
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor): void => {
            log = displayProcessor.displaySuite(suite, log);
        });
        this.log(log);
        this.increaseIndent();
    }

    computeSuiteIndent(): void {
        this.resetIndent();
        for (let i: number = 0; i < this.suiteHierarchyDisplayed.length; i++) {
            this.increaseIndent();
        }
    }

    log(stuff: String): void {
        if (stuff !== null) {
            if (this.displayWithoutColors) {
                stuff = stuff.stripColors;
            }
            console.log(this.currentIndent + stuff);
            this.lastWasNewLine = false;
        }
    }

    newLine(): void {
        if (!this.lastWasNewLine) {
            console.log("");
            this.lastWasNewLine = true;
        }
    }

    resetIndent(): void {
        this.currentIndent = "";
    }

    increaseIndent(): void {
        this.currentIndent += this.indent;
    }

    decreaseIndent(): void {
        this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
    }
}
