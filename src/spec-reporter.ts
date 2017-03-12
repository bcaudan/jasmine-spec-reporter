import { Configuration } from "./configuration";
import { ConfigurationParser } from "./configuration-parser";
import { CustomReporterResult } from "./custom-reporter-result";
import { ExecutionDisplay } from "./execution-display";
import { ExecutionMetrics } from "./execution-metrics";
import CustomReporter = jasmine.CustomReporter;
import SuiteInfo = jasmine.SuiteInfo;
import RunDetails = jasmine.RunDetails;

export class SpecReporter implements CustomReporter {
    private started = false;
    private finished = false;
    private display: ExecutionDisplay;
    private metrics: ExecutionMetrics;
    private configuration: Configuration;

    constructor(configuration?: Configuration) {
        this.configuration = ConfigurationParser.parse(configuration);
        this.display = new ExecutionDisplay(this.configuration);
        this.metrics = new ExecutionMetrics();
    }

    public jasmineStarted(suiteInfo: SuiteInfo): void {
        this.started = true;
        this.metrics.start(suiteInfo);
        this.display.jasmineStarted(suiteInfo);
    }

    public jasmineDone(runDetails: RunDetails): void {
        this.metrics.stop(runDetails);
        this.display.summary(this.metrics);
        this.finished = true;
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
