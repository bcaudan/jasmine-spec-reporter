import { Configuration } from "./configuration";
import { ConfigurationParser } from "./configuration-parser";
import { ExecutionDisplay } from "./execution-display";
import { ExecutionMetrics } from "./execution-metrics";

export class SpecReporter {
    private started: boolean = false;
    private finished: boolean = false;
    private display: ExecutionDisplay;
    private metrics: ExecutionMetrics;
    private configuration: Configuration;

    constructor(configuration?: Configuration) {
        this.configuration = ConfigurationParser.parse(configuration);
        this.display = new ExecutionDisplay(this.configuration);
        this.metrics = new ExecutionMetrics();
    }

    public jasmineStarted(info: any): void {
        this.started = true;
        this.metrics.start(info);
        this.display.jasmineStarted(info);
    }

    public jasmineDone(info: any): void {
        this.metrics.stop(info);
        this.display.summary(this.metrics);
        this.finished = true;
    }

    public suiteStarted(suite: any): void {
        this.display.suiteStarted(suite);
    }

    public suiteDone(): void {
        this.display.suiteDone();
    }

    public specStarted(spec: any): void {
        this.metrics.startSpec();
        this.display.specStarted(spec);
    }

    public specDone(spec: any): void {
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
