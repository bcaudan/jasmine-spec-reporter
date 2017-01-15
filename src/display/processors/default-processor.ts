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
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
            logs.push("- ".failed + spec.failedExpectations[i].message.failed);
            if (withStacktrace && spec.failedExpectations[i].stack) {
                logs.push(this.configuration.stacktrace.filter(spec.failedExpectations[i].stack));
            }
        }
        return logs.join("\n");
    }
}
