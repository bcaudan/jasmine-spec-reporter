import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: any): String {
        return spec.description;
    }

    private static displayErrorMessages(spec: any, withStacktrace: boolean): String {
        const logs: String[] = [];
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
            logs.push("- ".failed + spec.failedExpectations[i].message.failed);
            if (withStacktrace && spec.failedExpectations[i].stack) {
                logs.push(DefaultProcessor.filterStackTraces(spec.failedExpectations[i].stack));
            }
        }
        return logs.join("\n");
    }

    private static filterStackTraces(traces: string): string {
        const lines: string[] = traces.split("\n");
        const filtered: string[] = [];
        for (let i: number = 1; i < lines.length; i++) {
            if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
                filtered.push(lines[i]);
            }
        }
        return filtered.join("\n");
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
        return DefaultProcessor.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
    }

    public displaySummaryErrorMessages(spec: any): String {
        return DefaultProcessor.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
    }

    public displayPendingSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }
}
