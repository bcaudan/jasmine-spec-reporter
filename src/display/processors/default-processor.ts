import { DisplayProcessor } from "../display-processor";
import { Configuration } from "../../configuration";

export class DefaultProcessor extends DisplayProcessor {
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        super(configuration);
        this.configuration = configuration;
    }

    displayJasmineStarted(): String {
        return "Spec started";
    }

    displaySuite(suite: any): String {
        return suite.description;
    }

    displaySuccessfulSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    displayFailedSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    displaySpecErrorMessages(spec: any): String {
        return DefaultProcessor.displayErrorMessages(spec, this.configuration.spec.displayStacktrace);
    }

    displaySummaryErrorMessages(spec: any): String {
        return DefaultProcessor.displayErrorMessages(spec, this.configuration.summary.displayStacktrace);
    }

    displayPendingSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    private static displaySpecDescription(spec: any): String {
        return spec.description;
    }

    private static displayErrorMessages(spec: any, withStacktrace: boolean): String {
        let logs: String[] = [];
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
            logs.push("- ".failed + spec.failedExpectations[i].message.failed);
            if (withStacktrace && spec.failedExpectations[i].stack) {
                logs.push(DefaultProcessor.filterStackTraces(spec.failedExpectations[i].stack));
            }
        }
        return logs.join("\n");
    }

    private static filterStackTraces(traces: string): string {
        let lines: string[] = traces.split("\n");
        let filtered: string[] = [];
        for (let i: number = 1; i < lines.length; i++) {
            if (!/(jasmine[^\/]*\.js|Timer\.listOnTimeout)/.test(lines[i])) {
                filtered.push(lines[i]);
            }
        }
        return filtered.join("\n");
    }
}
