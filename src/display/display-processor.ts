import { Configuration } from "../configuration";

export class DisplayProcessor {
    protected configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public displayJasmineStarted(info: any, log: String): String {
        return log;
    }

    public displaySuite(suite: any, log: String): String {
        return log;
    }

    public displaySpecStarted(spec: any, log: String): String {
        return log;
    }

    public displaySuccessfulSpec(spec: any, log: String): String {
        return log;
    }

    public displayFailedSpec(spec: any, log: String): String {
        return log;
    }

    public displaySpecErrorMessages(spec: any, log: String): String {
        return log;
    }

    public displaySummaryErrorMessages(spec: any, log: String): String {
        return log;
    }

    public displayPendingSpec(spec: any, log: String): String {
        return log;
    }
}
