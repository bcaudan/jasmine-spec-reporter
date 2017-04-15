import {DisplayProcessor} from "../display-processor";
import {CustomReporterResult} from "../spec-reporter";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: CustomReporterResult): string {
        return spec.description;
    }

    public displayJasmineStarted(): string {
        return "Spec started";
    }

    public displaySuite(suite: CustomReporterResult): string {
        return suite.description;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayFailedSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displaySpecErrorMessages(spec: CustomReporterResult): string {
        return this.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
    }

    public displaySummaryErrorMessages(spec: CustomReporterResult): string {
        return this.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
    }

    public displayPendingSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    private displayErrorMessages(spec: CustomReporterResult, withStacktrace: boolean): string {
        const logs: string[] = [];
        for (const failedExpectation of spec.failedExpectations) {
            logs.push("- ".failed + failedExpectation.message.failed);
            if (withStacktrace && failedExpectation.stack) {
                logs.push(this.configuration.stacktrace.filter(failedExpectation.stack));
            }
        }
        return logs.join("\n");
    }
}
