import { DisplayProcessor } from "../display-processor";

export class SpecPrefixesProcessor extends DisplayProcessor {
    public displaySuccessfulSpec(spec: any, log: String): String {
        return this.configuration.prefixes.successful + log;
    }

    public displayFailedSpec(spec: any, log: String): String {
        return this.configuration.prefixes.failed + log;
    }

    public displayPendingSpec(spec: any, log: String): String {
        return this.configuration.prefixes.pending + log;
    }
}
