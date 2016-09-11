import { SpecDisplay } from "./spec-display";
import { SpecMetrics } from "./spec-metrics";
import { DisplayProcessor } from "./display-processor";

import { DefaultProcessor } from "./processors/default-processor";
import { SpecColorsProcessor } from "./processors/spec-colors-processor";
import { SpecDurationsProcessor } from "./processors/spec-durations-processor";
import { SpecPrefixesProcessor } from "./processors/spec-prefixes-processor";
import { SuiteNumberingProcessor } from "./processors/suite-numbering-processor";

import colors = require("colors");

export class SpecReporter {
    private started: boolean = false;
    private finished: boolean = false;
    private display: SpecDisplay;
    private metrics: SpecMetrics;
    private options: any;

    constructor(options?: any) {
        this.options = options || {};
        SpecReporter.initColors(this.options);
        let displayProcessors = SpecReporter.initProcessors(this.options);
        this.options.hasCustomDisplaySpecStarted = SpecReporter.hasCustomDisplaySpecStarted(displayProcessors);

        this.display = new SpecDisplay(this.options, displayProcessors);
        this.metrics = new SpecMetrics();
    }

    private static initColors(options: any): void {
        colors.setTheme({
            success: options.colors && options.colors.success ? options.colors.success : "green",
            failure: options.colors && options.colors.failure ? options.colors.failure : "red",
            pending: options.colors && options.colors.pending ? options.colors.pending : "yellow"
        });
        colors.enabled = true;
    }

    private static initProcessors(options: any): DisplayProcessor[] {
        let displayProcessors: DisplayProcessor[] = [
            new DefaultProcessor(),
            new SpecPrefixesProcessor(options.prefixes),
            new SpecColorsProcessor()
        ];

        if (options.displaySpecDuration) {
            displayProcessors.push(new SpecDurationsProcessor());
        }

        if (options.displaySuiteNumber) {
            displayProcessors.push(new SuiteNumberingProcessor());
        }

        if (options.customProcessors) {
            options.customProcessors.forEach(<p extends DisplayProcessor>(Processor: {new(options: any): p; }) => {
                displayProcessors.push(new Processor(options));
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

    jasmineStarted(info: any): void {
        this.started = true;
        this.metrics.start(info);
        this.display.jasmineStarted(info);
    }

    jasmineDone(info: any): void {
        this.metrics.stop(info);
        this.display.summary(this.metrics);
        this.finished = true;
    }

    suiteStarted(suite: any): void {
        this.display.suiteStarted(suite);
    }

    suiteDone(): void {
        this.display.suiteDone();
    }

    specStarted(spec: any): void {
        this.metrics.startSpec();
        this.display.specStarted(spec);
    }

    specDone(spec: any): void {
        this.metrics.stopSpec(spec);
        if (spec.status === "pending") {
            this.metrics.pendingSpecs++;
            this.display.pending(spec);
        } else if (spec.status === "passed") {
            this.metrics.successfulSpecs++;
            this.display.successful(spec);
        } else if (spec.status === "failed") {
            this.metrics.failedSpecs++;
            this.display.failed(spec);
        }
    }
}
