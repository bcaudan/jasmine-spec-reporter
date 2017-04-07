import {Configuration} from "./configuration";
import {ConfigurationParser} from "./configuration-parser";
import {DisplayProcessor} from "./display-processor";
import {ExecutionDisplay} from "./display/execution-display";
import {Logger} from "./display/logger";
import {SummaryDisplay} from "./display/summary-display";
import {ExecutionMetrics} from "./execution-metrics";
import {DefaultProcessor} from "./processors/default-processor";
import {SpecColorsProcessor} from "./processors/spec-colors-processor";
import {SpecDurationsProcessor} from "./processors/spec-durations-processor";
import {SpecPrefixesProcessor} from "./processors/spec-prefixes-processor";
import {SuiteNumberingProcessor} from "./processors/suite-numbering-processor";

import CustomReporter = jasmine.CustomReporter;
import SuiteInfo = jasmine.SuiteInfo;
import RunDetails = jasmine.RunDetails;

export interface CustomReporterResult extends jasmine.CustomReporterResult {
    duration?: string;
}

export interface ExecutedSpecs {
    failed: CustomReporterResult[];
    pending: CustomReporterResult[];
    successful: CustomReporterResult[];
}

export class SpecReporter implements CustomReporter {
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

    private logger: Logger;
    private specs: ExecutedSpecs = {
        failed: [],
        pending: [],
        successful: []
    };
    private display: ExecutionDisplay;
    private summary: SummaryDisplay;
    private metrics: ExecutionMetrics;
    private configuration: Configuration;

    constructor(configuration?: Configuration) {
        this.configuration = ConfigurationParser.parse(configuration);
        const displayProcessors = SpecReporter.initProcessors(this.configuration);
        const print = this.configuration.print;
        this.logger = new Logger(displayProcessors, print);
        this.display = new ExecutionDisplay(this.configuration, this.logger, this.specs, displayProcessors);
        this.summary = new SummaryDisplay(this.logger, this.configuration, this.specs);
        this.metrics = new ExecutionMetrics();
    }

    public jasmineStarted(suiteInfo: SuiteInfo): void {
        this.metrics.start(suiteInfo);
        this.display.jasmineStarted(suiteInfo);
    }

    public jasmineDone(runDetails: RunDetails): void {
        this.metrics.stop(runDetails);
        this.summary.display(this.metrics);
    }

    public suiteStarted(result: CustomReporterResult): void {
        this.display.suiteStarted(result);
    }

    public suiteDone(result: CustomReporterResult): void {
        this.display.suiteDone();
    }

    public specStarted(result: CustomReporterResult): void {
        this.metrics.startSpec();
        this.display.specStarted(result);
    }

    public specDone(result: CustomReporterResult): void {
        this.metrics.stopSpec(result);
        if (result.status === "pending") {
            this.metrics.pendingSpecs++;
            this.display.pending(result);
        } else if (result.status === "passed") {
            this.metrics.successfulSpecs++;
            this.display.successful(result);
        } else if (result.status === "failed") {
            this.metrics.failedSpecs++;
            this.display.failed(result);
        }
    }
}
