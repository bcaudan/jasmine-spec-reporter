import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: any): String {
        return spec.description;
    }

    public displayJasmineStarted(): String {
        return "Spec started";
    }

    public displaySuite(suite: any): String {
        return suite.description;
    }

    public displaySuccessfulSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayFailedSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displaySpecErrorMessages(spec: any): String {
        return this.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
    }

    public displaySummaryErrorMessages(spec: any): String {
        return this.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
    }

    public displayPendingSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    private displayErrorMessages(spec: any, withStacktrace: boolean): String {
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
