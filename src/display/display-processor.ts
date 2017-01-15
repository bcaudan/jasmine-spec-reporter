import { Configuration } from "../configuration";
import { CustomReporterResult } from "../custom-reporter-result";
import SuiteInfo = jasmine.SuiteInfo;

export class DisplayProcessor {
    protected configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public displayJasmineStarted(info: SuiteInfo, log: String): String {
        return log;
    }

    public displaySuite(suite: CustomReporterResult, log: String): String {
        return log;
    }

    public displaySpecStarted(spec: CustomReporterResult, log: String): String {
        return log;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return log;
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return log;
    }

    public displaySpecErrorMessages(spec: CustomReporterResult, log: String): String {
        return log;
    }

    public displaySummaryErrorMessages(spec: CustomReporterResult, log: String): String {
        return log;
    }

    public displayPendingSpec(spec: CustomReporterResult, log: String): String {
        return log;
    }
}
