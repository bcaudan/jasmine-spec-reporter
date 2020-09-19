import {Configuration} from "./configuration";
import * as ConfigurationParser from "./configuration-parser";
import {DisplayProcessor} from "./display-processor";
import {ExecutionDisplay} from "./display/execution-display";
import {Logger} from "./display/logger";
import {SummaryDisplay} from "./display/summary-display";
import {ExecutionMetrics} from "./execution-metrics";
import {DefaultProcessor} from "./processors/default-processor";
import {PrettyStacktraceProcessor} from "./processors/pretty-stacktrace-processor";
import {SpecColorsProcessor} from "./processors/spec-colors-processor";
import {SpecDurationsProcessor} from "./processors/spec-durations-processor";
import {SpecPrefixesProcessor} from "./processors/spec-prefixes-processor";
import {SuiteNumberingProcessor} from "./processors/suite-numbering-processor";
import {Theme} from "./theme";

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
    private static initProcessors(configuration: Configuration, theme: Theme): DisplayProcessor[] {
        const displayProcessors: DisplayProcessor[] = [
            new DefaultProcessor(configuration, theme),
            new SpecPrefixesProcessor(configuration, theme),
            new SpecColorsProcessor(configuration, theme),
            new PrettyStacktraceProcessor(configuration, theme)
        ];

        if (configuration.spec.displayDuration) {
            displayProcessors.push(new SpecDurationsProcessor(configuration, theme));
        }

        if (configuration.suite.displayNumber) {
            displayProcessors.push(new SuiteNumberingProcessor(configuration, theme));
        }

        if (configuration.customProcessors) {
            configuration.customProcessors.forEach((Processor: typeof DisplayProcessor) => {
                displayProcessors.push(new Processor(configuration, theme));
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
    private theme: Theme;

    constructor(configuration?: Configuration) {
        this.configuration = ConfigurationParser.parse(configuration);
        this.theme = new Theme(this.configuration);
        const displayProcessors = SpecReporter.initProcessors(this.configuration, this.theme);
        const print = this.configuration.print;
        this.logger = new Logger(displayProcessors, print);
        this.display = new ExecutionDisplay(this.configuration, this.logger, this.specs, displayProcessors);
        this.summary = new SummaryDisplay(this.configuration, this.theme, this.logger, this.specs);
        this.metrics = new ExecutionMetrics();
    }

    public jasmineStarted(suiteInfo: SuiteInfo): void {
        this.metrics.start(suiteInfo);
        this.display.jasmineStarted(suiteInfo);
    }

    public jasmineDone(runDetails: RunDetails): void {
        this.metrics.stop(runDetails);
        if (runDetails.failedExpectations && runDetails.failedExpectations.length) {
            const error = this.runDetailsToResult(runDetails);
            this.metrics.globalErrors.push(error);
            this.display.failed(error);
        }
        this.summary.display(this.metrics);
    }

    public suiteStarted(result: CustomReporterResult): void {
        this.display.suiteStarted(result);
    }

    public suiteDone(result: CustomReporterResult): void {
        this.display.suiteDone(result);
        if (result.failedExpectations.length) {
            this.metrics.globalErrors.push(result);
        }
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

    private runDetailsToResult(runDetails: RunDetails): CustomReporterResult {
        return {
            description: "Non-spec failure",
            failedExpectations: runDetails.failedExpectations.map(expectation => {
                return {
                    actual: "",
                    expected: "",
                    matcherName: "",
                    message: expectation.message,
                    passed: false,
                    stack: (expectation as any).stack,
                };
            }),
            fullName: "Non-spec failure",
            id: "Non-spec failure",
        };
    }

}
