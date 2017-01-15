import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class SpecPrefixesProcessor extends DisplayProcessor {
    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return this.configuration.prefixes.successful + log;
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return this.configuration.prefixes.failed + log;
    }

    public displayPendingSpec(spec: CustomReporterResult, log: String): String {
        return this.configuration.prefixes.pending + log;
    }
}
