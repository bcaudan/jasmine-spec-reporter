import { Configuration } from "./configuration";
import { ColorsDisplay } from "./display/colors-display";
import { DisplayProcessor } from "./display/display-processor";
import { DefaultProcessor } from "./display/processors/default-processor";
import { SpecColorsProcessor } from "./display/processors/spec-colors-processor";
import { SpecDurationsProcessor } from "./display/processors/spec-durations-processor";
import { SpecPrefixesProcessor } from "./display/processors/spec-prefixes-processor";
import { SuiteNumberingProcessor } from "./display/processors/suite-numbering-processor";
import { ExecutionMetrics } from "./execution-metrics";

type ProcessFunction = (displayProcessor: DisplayProcessor, object: any, log: String) => String;

export class ExecutionDisplay {
    private static initProcessors(configuration: Configuration): DisplayProcessor[] {
        const displayProcessors: DisplayProcessor[] = [
            new DefaultProcessor(configuration),
            new SpecPrefixesProcessor(configuration),
            new SpecColorsProcessor(configuration),
        ];

        if (configuration.spec.displayDuration) {
            displayProcessors.push(new SpecDurationsProcessor(configuration));
        }

        if (configuration.suite.displayNumber) {
            displayProcessors.push(new SuiteNumberingProcessor(configuration));
        }

        if (configuration.customProcessors) {
            configuration.customProcessors.forEach((Processor: typeof DisplayProcessor) => {
                displayProcessors.push(new Processor(configuration));
            });
        }

        return displayProcessors;
    }

    private static hasCustomDisplaySpecStarted(processors: DisplayProcessor[]): boolean {
        let isDisplayed: boolean = false;
        processors.forEach((processor: DisplayProcessor) => {
            const log: string = "foo";
            const result = processor.displaySpecStarted({ id: "bar", description: "bar", fullName: "bar" }, log);
            isDisplayed = isDisplayed || result !== log;
        });
        return isDisplayed;
    }

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

    public jasmineStarted(runner: any): void {
        this.process(runner, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
            return displayProcessor.displayJasmineStarted(object, log);
        });
    }

    public summary(metrics: ExecutionMetrics): void {
        const pluralizedSpec: string = (metrics.totalSpecsDefined === 1 ? " spec " : " specs ");
        const execution: string = `Executed ${metrics.executedSpecs} of ${metrics.totalSpecsDefined}${pluralizedSpec}`;
        const successful: string = (metrics.failedSpecs === 0) ? "SUCCESS " : "";
        const failed: string = (metrics.failedSpecs > 0) ? `(${metrics.failedSpecs} FAILED) ` : "";
        const pending: string = (metrics.pendingSpecs > 0) ? `(${metrics.pendingSpecs} PENDING) ` : "";
        const skipped: string = (metrics.skippedSpecs > 0) ? `(${metrics.skippedSpecs} SKIPPED) ` : "";
        const duration: string = `in ${metrics.duration}.`;

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

    public specStarted(spec: any): void {
        if (this.hasCustomDisplaySpecStarted) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                return displayProcessor.displaySpecStarted(object, log);
            });
        }
    }

    public successful(spec: any): void {
        this.successfulSpecs.push(spec);
        if (this.configuration.spec.displaySuccessful) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                return displayProcessor.displaySuccessfulSpec(object, log);
            });
        }
    }

    public failed(spec: any): void {
        this.failedSpecs.push(spec);
        if (this.configuration.spec.displayFailed) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                return displayProcessor.displayFailedSpec(object, log);
            });
            if (this.configuration.spec.displayErrorMessages) {
                this.increaseIndent();
                this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                    return displayProcessor.displaySpecErrorMessages(object, log);
                });
                this.decreaseIndent();
            }
        }
    }

    public pending(spec: any): void {
        this.pendingSpecs.push(spec);
        if (this.configuration.spec.displayPending) {
            this.ensureSuiteDisplayed();
            this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                return displayProcessor.displayPendingSpec(object, log);
            });
        }
    }

    public suiteStarted(suite: any): void {
        this.suiteHierarchy.push(suite);
    }

    public suiteDone(): void {
        const suite = this.suiteHierarchy.pop();
        if (this.suiteHierarchyDisplayed[this.suiteHierarchyDisplayed.length - 1] === suite) {
            this.suiteHierarchyDisplayed.pop();
        }
        this.newLine();
        this.decreaseIndent();
    }

    private successesSummary(): void {
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

    private successfulSummary(spec: any, index: number): void {
        this.log(`${index}) ${spec.fullName}`);
    }

    private failuresSummary(): void {
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

    private failedSummary(spec: any, index: number): void {
        this.log(`${index}) ${spec.fullName}`);
        if (this.configuration.summary.displayErrorMessages) {
            this.increaseIndent();
            this.process(spec, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
                return displayProcessor.displaySummaryErrorMessages(object, log);
            });
            this.decreaseIndent();
        }
    }

    private pendingsSummary(): void {
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

    private pendingSummary(spec: any, index: number) {
        this.log(`${index}) ${spec.fullName}`);
        this.increaseIndent();
        const pendingReason = spec.pendingReason ? spec.pendingReason : "No reason given";
        this.log(pendingReason.pending);
        this.resetIndent();
    }

    private ensureSuiteDisplayed(): void {
        if (this.suiteHierarchy.length !== 0) {
            for (let i: number = this.suiteHierarchyDisplayed.length; i < this.suiteHierarchy.length; i++) {
                this.suiteHierarchyDisplayed.push(this.suiteHierarchy[i]);
                this.displaySuite(this.suiteHierarchy[i]);
            }
        } else {
            const topLevelSuite: any = { description: "Top level suite" };
            this.suiteHierarchy.push(topLevelSuite);
            this.suiteHierarchyDisplayed.push(topLevelSuite);
            this.displaySuite(topLevelSuite);
        }
    }

    private displaySuite(suite: any): void {
        this.newLine();
        this.computeSuiteIndent();
        this.process(suite, (displayProcessor: DisplayProcessor, object: any, log: String): String => {
            return displayProcessor.displaySuite(object, log);
        });
        this.increaseIndent();
    }

    private process(object: any, processFunction: ProcessFunction): void {
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor) => {
            log = processFunction(displayProcessor, object, log);
        });
        this.log(log);
    }

    private computeSuiteIndent(): void {
        this.resetIndent();
        for (let i: number = 0; i < this.suiteHierarchyDisplayed.length; i++) {
            this.increaseIndent();
        }
    }

    private log(stuff: String): void {
        if (stuff !== null) {
            stuff.split("\n").forEach((line: String) => {
                console.log(line !== "" ? this.currentIndent + line : line);
            });
            this.lastWasNewLine = false;
        }
    }

    private newLine(): void {
        if (!this.lastWasNewLine) {
            console.log("");
            this.lastWasNewLine = true;
        }
    }

    private resetIndent(): void {
        this.currentIndent = "";
    }

    private increaseIndent(): void {
        this.currentIndent += this.indent;
    }

    private decreaseIndent(): void {
        this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
    }
}
