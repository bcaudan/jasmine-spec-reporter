import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: CustomReporterResult): String {
        return spec.description;
    }

    public displayJasmineStarted(): String {
        return "Spec started";
    }

    public displaySuite(suite: CustomReporterResult): String {
        return suite.description;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayFailedSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displaySpecErrorMessages(spec: CustomReporterResult): String {
        return this.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
    }

    public displaySummaryErrorMessages(spec: CustomReporterResult): String {
        return this.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
    }

    public displayPendingSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    private displayErrorMessages(spec: CustomReporterResult, withStacktrace: boolean): String {
        const logs: String[] = [];
        for (const failedExpectation of spec.failedExpectations) {
            logs.push("- ".failed + failedExpectation.message.failed);
            if (withStacktrace && failedExpectation.stack) {
                logs.push(this.configuration.stacktrace.filter(failedExpectation.stack));
            }
        }
        return logs.join("\n");
    }
}
