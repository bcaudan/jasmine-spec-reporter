import {Configuration} from "../configuration";
import {DisplayProcessor} from "../display-processor";
import {ExecutionMetrics} from "../execution-metrics";
import {CustomReporterResult, ExecutedSpecs} from "../spec-reporter";
import {Logger} from "./logger";

export class SummaryDisplay {
    constructor(private logger: Logger, private configuration: Configuration, private specs: ExecutedSpecs) {
    }

    public display(metrics: ExecutionMetrics) {
        const pluralizedSpec = (metrics.totalSpecsDefined === 1 ? " spec" : " specs");
        const execution = `Executed ${metrics.executedSpecs} of ${metrics.totalSpecsDefined}${pluralizedSpec}`;
        let status = "";
        if (metrics.failedSpecs === 0 && metrics.globalErrors.length === 0) {
            status = (metrics.totalSpecsDefined === metrics.executedSpecs) ?
                " SUCCESS".successful : " INCOMPLETE".pending;
        }
        const failed = (metrics.failedSpecs > 0) ? ` (${metrics.failedSpecs} FAILED)` : "";
        const pending = (metrics.pendingSpecs > 0) ? ` (${metrics.pendingSpecs} PENDING)` : "";
        const skipped = (metrics.skippedSpecs > 0) ? ` (${metrics.skippedSpecs} SKIPPED)` : "";
        let errors = (metrics.globalErrors.length > 1) ? ` (${metrics.globalErrors.length} ERRORS)` : "";
        errors = (metrics.globalErrors.length === 1) ? ` (${metrics.globalErrors.length} ERROR)` : errors;
        const duration = this.configuration.summary.displayDuration ? ` in ${metrics.duration}` : "";

        this.logger.resetIndent();
        this.logger.newLine();
        if (this.configuration.summary.displaySuccessful && metrics.successfulSpecs > 0) {
            this.successesSummary();
        }
        if (this.configuration.summary.displayFailed && metrics.failedSpecs > 0) {
            this.failuresSummary();
        }
        if (this.configuration.summary.displayFailed && metrics.globalErrors.length > 0) {
            this.errorsSummary(metrics.globalErrors);
        }
        if (this.configuration.summary.displayPending && metrics.pendingSpecs > 0) {
            this.pendingsSummary();
        }
        this.logger.log(execution + status + errors.failed + failed.failed
            + pending.pending + skipped.pending + duration + ".");

        if (metrics.random) {
            this.logger.log(`Randomized with seed ${metrics.seed}.`);
        }
    }

    private successesSummary(): void {
        this.logger.log("**************************************************");
        this.logger.log("*                   Successes                    *");
        this.logger.log("**************************************************");
        this.logger.newLine();
        for (let i = 0; i < this.specs.successful.length; i++) {
            this.successfulSummary(this.specs.successful[i], i + 1);
            this.logger.newLine();
        }
        this.logger.newLine();
        this.logger.resetIndent();
    }

    private successfulSummary(spec: CustomReporterResult, index: number): void {
        this.logger.log(`${index}) ${spec.fullName}`);
    }

    private failuresSummary(): void {
        this.logger.log("**************************************************");
        this.logger.log("*                    Failures                    *");
        this.logger.log("**************************************************");
        this.logger.newLine();
        for (let i = 0; i < this.specs.failed.length; i++) {
            this.failedSummary(this.specs.failed[i], i + 1);
            this.logger.newLine();
        }
        this.logger.newLine();
        this.logger.resetIndent();
    }

    private failedSummary(spec: CustomReporterResult, index: number): void {
        this.logger.log(`${index}) ${spec.fullName}`);
        if (this.configuration.summary.displayErrorMessages) {
            this.logger.increaseIndent();
            this.logger.process(
                spec,
                (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: string) => {
                    return displayProcessor.displaySummaryErrorMessages(object, log);
                }
            );
            this.logger.decreaseIndent();
        }
    }

    private pendingsSummary(): void {
        this.logger.log("**************************************************");
        this.logger.log("*                    Pending                     *");
        this.logger.log("**************************************************");
        this.logger.newLine();
        for (let i = 0; i < this.specs.pending.length; i++) {
            this.pendingSummary(this.specs.pending[i], i + 1);
            this.logger.newLine();
        }
        this.logger.newLine();
        this.logger.resetIndent();
    }

    private pendingSummary(spec: CustomReporterResult, index: number) {
        this.logger.log(`${index}) ${spec.fullName}`);
        this.logger.increaseIndent();
        const pendingReason = spec.pendingReason ? spec.pendingReason : "No reason given";
        this.logger.log(pendingReason.pending);
        this.logger.resetIndent();
    }

    private errorsSummary(errors: CustomReporterResult[]): void {
        this.logger.log("**************************************************");
        this.logger.log("*                     Errors                     *");
        this.logger.log("**************************************************");
        this.logger.newLine();
        for (let i = 0; i < errors.length; i++) {
            this.errorSummary(errors[i], i + 1);
            this.logger.newLine();
        }
        this.logger.newLine();
        this.logger.resetIndent();
    }

    private errorSummary(error: CustomReporterResult, index: number): void {
        this.logger.log(`${index}) ${error.fullName}`);
        this.logger.increaseIndent();
        this.logger.process(
            error,
            (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: string) => {
                return displayProcessor.displaySummaryErrorMessages(object, log);
            }
        );
        this.logger.decreaseIndent();
    }

}
