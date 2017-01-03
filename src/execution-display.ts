import { DefaultProcessor } from "./display/processors/default-processor";
import { SpecColorsProcessor } from "./display/processors/spec-colors-processor";
import { SpecDurationsProcessor } from "./display/processors/spec-durations-processor";
import { SpecPrefixesProcessor } from "./display/processors/spec-prefixes-processor";
import { SuiteNumberingProcessor } from "./display/processors/suite-numbering-processor";
import { DisplayProcessor } from "./display/display-processor";
import { ExecutionMetrics } from "./execution-metrics";
import { ColorsDisplay } from "./display/colors-display";
import { Configuration } from "./configuration";

export class ExecutionDisplay {
    private indent: string = "  ";
    private currentIndent: string = "";
    private suiteHierarchy: any[] = [];
    private suiteHierarchyDisplayed: any[] = [];
    private successfulSpecs: any[] = [];
    private failedSpecs: any[] = [];
    private pendingSpecs: any[] = [];
    private lastWasNewLine: boolean = false;
    private hasCustomDisplaySpecStarted: boolean;
    private displayProcessors: DisplayProcessor[];

    constructor(private configuration: Configuration) {
        ColorsDisplay.init(this.configuration);
        this.displayProcessors = ExecutionDisplay.initProcessors(this.configuration);
        this.hasCustomDisplaySpecStarted = ExecutionDisplay.hasCustomDisplaySpecStarted(this.displayProcessors);
    }

    private static initProcessors(configuration: Configuration): DisplayProcessor[] {
        let displayProcessors: DisplayProcessor[] = [
            new DefaultProcessor(configuration),
            new SpecPrefixesProcessor(configuration),
            new SpecColorsProcessor(configuration)
        ];

        if (configuration.spec.displayDuration) {
            displayProcessors.push(new SpecDurationsProcessor(configuration));
        }

        if (configuration.suite.displayNumber) {
            displayProcessors.push(new SuiteNumberingProcessor(configuration));
        }

        if (configuration.customProcessors) {
            configuration.customProcessors.forEach(<p extends DisplayProcessor>(Processor: {new(configuration: Configuration): p; }) => {
                displayProcessors.push(new Processor(configuration));
            });
        }

        return displayProcessors;
    }

    private static hasCustomDisplaySpecStarted(processors: DisplayProcessor[]): boolean {
        let isDisplayed: boolean = false;
        processors.forEach((processor: DisplayProcessor) => {
            let log: string = "foo";
            let result = processor.displaySpecStarted({ id: "bar", description: "bar", fullName: "bar" }, log);
            isDisplayed = isDisplayed || result !== log;
        });
        return isDisplayed;
    }

    jasmineStarted(runner: any): void {
        this.process(runner, (displayProcessor: DisplayProcessor, runner: any, log: String): String => {
            return displayProcessor.displayJasmineStarted(runner, log);
        });
    }

    summary(metrics: ExecutionMetrics): void {
        let execution: string = `Executed ${metrics.executedSpecs} of ${metrics.totalSpecsDefined}${(metrics.totalSpecsDefined === 1 ? " spec " : " specs ")}`;
        let successful: string = (metrics.failedSpecs === 0) ? "SUCCESS " : "";
        let failed: string = (metrics.failedSpecs > 0) ? `(${metrics.failedSpecs} FAILED) ` : "";
        let pending: string = (metrics.pendingSpecs > 0) ? `(${metrics.pendingSpecs} PENDING) ` : "";
        let skipped: string = (metrics.skippedSpecs > 0) ? `(${metrics.skippedSpecs} SKIPPED) ` : "";
        let duration: string = `in ${metrics.duration}.`;

        this.resetIndent();
        this.newLine();
        if (this.configuration.summary.displaySuccessful && metrics.successfulSpecs > 0) {
            this.successesSummary();
        }
        if (this.configuration.summary.displayFailed && metrics.failedSpecs > 0) {
            this.failuresSummary();
        }
        if (this.configuration.summary.displayPending && metrics.pendingSpecs > 0) {
            this.pendingsSummary();
        }
        this.log(execution + successful.successful + failed.failed + pending.pending + skipped + duration);

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
        this.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
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
            this.process(spec, (displayProcessor: DisplayProcessor, spec: any, log: String): String => {
                return displayProcessor.displaySpecStarted(spec, log);
            });
        }
    }

    successful(spec: any): void {
        this.successfulSpecs.push(spec);
        if (this.configuration.spec.displaySuccessful) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, spec: any, log: String): String => {
                return displayProcessor.displaySuccessfulSpec(spec, log);
            });
        }
    }

    failed(spec: any): void {
        this.failedSpecs.push(spec);
        if (this.configuration.spec.displayFailed) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, spec: any, log: String): String => {
                return displayProcessor.displayFailedSpec(spec, log);
            });
            this.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
        }
    }

    pending(spec: any): void {
        this.pendingSpecs.push(spec);
        if (this.configuration.spec.displayPending) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, spec: any, log: String): String => {
                return displayProcessor.displayPendingSpec(spec, log);
            });
        }
    }

    displayErrorMessages(spec: any, withStacktrace: boolean): void {
        this.increaseIndent();
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
            this.log("- ".failed + spec.failedExpectations[i].message.failed);
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
        this.process(suite, (displayProcessor: DisplayProcessor, suite: any, log: String): String => {
            return displayProcessor.displaySuite(suite, log);
        });
        this.increaseIndent();
    }

    process(object: any, processFunction: (displayProcessor: DisplayProcessor, object: any, log: String) => String): void {
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor) => {
            log = processFunction(displayProcessor, object, log);
        });
        this.log(log);
    }

    computeSuiteIndent(): void {
        this.resetIndent();
        for (let i: number = 0; i < this.suiteHierarchyDisplayed.length; i++) {
            this.increaseIndent();
        }
    }

    log(stuff: String): void {
        if (stuff !== null) {
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
